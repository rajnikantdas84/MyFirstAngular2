import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Router } from "@angular/router";
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-tenant-forgot-password',
  templateUrl: './tenant-forgot-password.component.html',
  styleUrls: ['./tenant-forgot-password.component.css']
})
export class TenantForgotPasswordComponent implements OnInit {

  invalidEmail: boolean = false;
  successMsg = "";
  errorMsg = "";
  agenturl = "";
  bannercolor: string;

  constructor(private auth: AuthService, private route: Router) { }
  checkEmail(credentials) {
    this.auth.tenantForgotPassword(credentials)
    .subscribe(result => { 
    if (result['status'] == true) {
     // console.log(result);
      this.successMsg = "success";
      this.invalidEmail = false;
      //this.route.navigate(['admin/dashboard']);
    }
    else if(result['status'] == false) {
      this.invalidEmail = true;
      this.errorMsg = "There are some error. Please try again later!";
    }
    else {
      console.log('Invalid Email');
      this.invalidEmail = true;
      this.errorMsg = "Email not registered with us.";
      this.successMsg = "";
    }

    });
	}

  ngOnInit() {
    this.agenturl = localStorage.getItem('agent_url');
    this.bannercolor = localStorage.getItem('bannercolor');
  }

}
