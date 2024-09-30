import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent  implements OnInit {
  updateCustomerFormGroup! : FormGroup;
  CusId = 0;
  customer! : Customer;
  errorMessage! : "";

  constructor(private fb : FormBuilder, 
    private customerService:CustomerService, 
    private router:Router,
    private activedRoute : ActivatedRoute) { }
  
  ngOnInit(): void {
    this.updateCustomerFormGroup=this.fb.group({
      name : this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      email : this.fb.control(null,[Validators.required, Validators.email])
    });

    this.activedRoute.params.subscribe(params => {
      this.CusId = params["id"];
    });

    this.getCustomer();
  }


  getCustomer() {
    //let customer : Customer=this.updateCustomerFormGroup.value;
    this.customerService.getCustomer(this.CusId).subscribe({
      next : data => {
        this.customer = data;
        this.updateCustomerFormGroup.setValue({
          email : data.email,
          name : data.name
        });
      },
      error : err => {
        console.log(err);
      }
    });
  }

 

  handleUpdateCustomer() {
    this.customer = this.updateCustomerFormGroup.value;
    this.customerService.updateCustomer(this.CusId, this.customer).subscribe({
      next : data=>{
        Swal.fire("Customer has been successfully updated!", "", "success");
        //this.newCustomerFormGroup.reset();
        this.router.navigateByUrl("/customers");
      },
      error : err => {
        console.log(err);
      }
    });
  }
}

