import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CustomerService} from "../services/customer.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers! : Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup : FormGroup | undefined;
  constructor(private customerService : CustomerService, private fb : FormBuilder, private router : Router) { }

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    Swal.fire({
      title: "Are you sure have Delete this Customer "+c.name+" !",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then((result) => {
      if (result.isConfirmed) {
        this.handleDeleteCustomerValided(c);
      } else if (result.isDenied) {
        Swal.fire("Customer has not deleted", "", "info");
      }
    });
  }

  handleDeleteCustomerValided(c: Customer) {
    //let conf = confirm("Are you sure to Delete this Customer?");
    //if(!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next : (resp) => {
        
          this.customers=this.customers.pipe(
            map(data=>{
              let index = data.indexOf(c);
              data.slice(index,1)
              return data;
            })
          );
          Swal.fire("Deleted!", "", "success");
        
      },
      error : err => {
        Swal.fire("Customer has not deleted, he have accounts!", "", "warning");
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/"+customer.id,{state :customer});
  }
}
