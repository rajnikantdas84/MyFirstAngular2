import { Component, OnInit } from '@angular/core';
import { AgentService } from './../services/agent.service';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issue-comments',
  templateUrl: './issue-comments.component.html',
  styleUrls: ['./issue-comments.component.css']
})
export class IssueCommentsComponent implements OnInit {

  result;
  records: any[];
  issueid;
  constructor(private agent: AgentService, private http: Http, private activateroute: ActivatedRoute) {

  }

  ngOnInit() {
    this.result = this.activateroute.params.subscribe(params=> {
      this.issueid = params['id'];
      this.agent.getIssueUpdateDetails(params['id'])
      .subscribe(result => {
        if(result) {
          this.records = result;
        }
      }); 
    });    
  }
}
