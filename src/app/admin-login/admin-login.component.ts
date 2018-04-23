import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from './../services/auth.service';
import { Http } from '@angular/http';


@Component({
  selector: 'admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
 invalidLogin: boolean;

  constructor( private auth: AuthService, private router: Router ) {

    if(localStorage.getItem('auth_key')) {
      this.router.navigate(['admin/dashboard']);
    }
  }
   
  	signIn(credentials) {
		  this.auth.authenticatenow(credentials)
      .subscribe(result => {
      if (result) {
        this.router.navigate(['admin/dashboard']);
      }
      else {
        this.invalidLogin = true;
      }

      });
	}

  ngOnInit() {} 
}

