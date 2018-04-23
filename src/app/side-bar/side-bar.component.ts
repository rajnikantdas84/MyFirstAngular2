import { Component } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Http } from '@angular/http';
import { NgStyle } from '@angular/common';
import { AgentService } from './../services/agent.service';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent{
  bannercolor: string;
  isAdmin: boolean = true;
  constructor(private auth: AuthService, private agent: AgentService) {
      let admin_role = localStorage.getItem('admin_role');
      if( admin_role != "1") {
        this.isAdmin = false;
      }
    this.agent.getPageSettings(localStorage.getItem('auth_key'))
    .subscribe(result => {
        this.bannercolor = result.banner_color;
    });      
   }
}
