import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Router } from "@angular/router";


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  invalidEmail: boolean = false;
  successMsg = "";
  errorMsg = "";
  constructor(private auth: AuthService, private route: Router) { }

  checkEmail(credentials) {
    this.auth.forgotPassword(credentials)
    .subscribe(result => { 
    if (result['status'] == true) {
      console.log(result);
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
  }

}
