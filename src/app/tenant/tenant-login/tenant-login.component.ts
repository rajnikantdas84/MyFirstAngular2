import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ActivatedRoute  } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-tenant-login',
  templateUrl: './tenant-login.component.html',
  styleUrls: ['./tenant-login.component.css']
})
export class TenantLoginComponent implements OnInit {
  agentUsername;
  invalidLogin: boolean;
  bannercolor: string;

  constructor(private route: ActivatedRoute, private agent: AgentService, private router: Router) {
    if(localStorage.getItem('customer_key')) {
      this.router.navigate(['/tenant-dashboard']);
    }

   }

  ngOnInit() {
    this.agentUsername = this.route.snapshot.paramMap.get('agentuser');
    localStorage.setItem('agent_url', this.agentUsername);
    this.agent.getPageSettings(localStorage.getItem('agent_url'))
    .subscribe(result => {
        this.bannercolor = result.banner_color;
        localStorage.setItem('bannercolor', this.bannercolor);
    });    
  }
  customerLogin(credentials) {
    this.agent.authenticateTenant(credentials)
      .subscribe(result => {
        if (result) {
          localStorage.setItem('agent_url', this.agentUsername);
          this.router.navigate(['/tenant-dashboard']);

        }
        else {
          this.invalidLogin = true;
        }
      });    
  }

}
