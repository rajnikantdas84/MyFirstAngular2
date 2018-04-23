import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  result;
  records: any[];
  issueid;
  tenantName;
  agentUsername;
  bannercolor: string;
  constructor(private agent: AgentService, private http: Http, private activateroute: ActivatedRoute) {

   }
  onMouseOut($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
    console.log("mouseout");
     console.log($value);

  }
  onMouseOver($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
     console.log("mouseover");
      console.log($value);
  }
  ngOnInit() {
    this.bannercolor = localStorage.getItem('bannercolor');
    this.agentUsername = localStorage.getItem('agent_url');
    this.tenantName = localStorage.getItem('customer_name');
    this.result = this.activateroute.params.subscribe(params=> {
      this.issueid = params['id'];
      this.agent.getIssueUpdateDetails(params['id'])
      .subscribe(result => { console.log(result);
        if(result) {
          this.records = result;
        }
      }); 
    });    
  }    
}
