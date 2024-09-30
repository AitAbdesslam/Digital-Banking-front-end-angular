import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../model/customer.model";
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts-component.html',
  styleUrls: ['./customer-accounts-component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId! : number ;
  customer! : Customer;
  accounts : any;
  constructor(private route : ActivatedRoute, private router :Router, private customerService:CustomerService) {
    //this.customer=this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.getCustomer();
    this.getCustomerAccounts();
  }

  getCustomer() {
    this.customerService.getCustomer(this.customerId).subscribe({
      next : data => {
        this.customer = data;
      },
      error : err => {
        console.log(err);
      }
    });
  }

  getCustomerAccounts() {
    this.customerService.getCustomerAccounts(this.customerId).subscribe({
      next : data => {
        this.accounts = data;
      },
      error : err => {
        console.log(err);
      }
    });
  }

  handleUpdateCustomer(customer : Customer){
    this.router.navigateByUrl('/update-customer/'+customer.id);
  }

}
