import { AgentService } from './../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { AuthService } from './../services/auth.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  adminUserName: any;
  bannercolor: string;
  constructor(private authservice: AuthService, private agent: AgentService) { 
    this.adminUserName = localStorage.getItem('auth_key');
    this.agent.getPageSettings(localStorage.getItem('auth_key'))
    .subscribe(result => {
        this.bannercolor = result.banner_color;
    });

  }
  onMouseOut($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("opacity", "1");
  }
  onMouseOver($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("opacity", "0.5");
  }  
  ngOnInit() {
  }
  adminUser() {
    return localStorage.getItem('name');
  }
 
  logOut() {
    this.authservice.logout();
  }
}
