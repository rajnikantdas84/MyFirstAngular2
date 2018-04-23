import { Component, OnInit } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { AdminLoginComponent } from './../admin-login/admin-login.component';
import { AuthService } from './../services/auth.service';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [HttpClient]
})
export class DashboardComponent implements OnInit {

  constructor() {
   }

  ngOnInit() {
  }

}
