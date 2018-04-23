import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { AgentService } from './../../services/agent.service';
import { ActivatedRouteSnapshot, Router, ActivatedRoute  } from '@angular/router';

declare var $;
@Component({
  selector: 'agent-landing-footer',
  templateUrl: './agent-landing-footer.component.html',
  styleUrls: ['./agent-landing-footer.component.css']
})
export class AgentLandingFooterComponent implements OnInit {
  date = new Date();
  currentYear: any;
  bannercolor: string;
  constructor(private agent: AgentService, private route: ActivatedRoute) {
    let agent_url = this.route.snapshot.paramMap.get('username');
    if(!this.route.snapshot.paramMap.get('username')) {
      agent_url = localStorage.getItem('agent_url');
    }    
    this.agent.getPageSettings(agent_url)
    .subscribe(result => {
        this.bannercolor = result.banner_color;
        localStorage.setItem('bannercolor', this.bannercolor);
    });    
   }
   
  ngOnInit() {
    this.currentYear = this.date.getFullYear();
  }

}
