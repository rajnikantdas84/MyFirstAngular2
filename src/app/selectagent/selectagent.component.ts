import { GlobalValues } from './../_helper/global';
import { Component, OnInit } from '@angular/core';
import { AgentService } from './../services/agent.service';
import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, Router, ActivatedRoute  } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import {SelectModule} from 'ng2-select';

declare var swal: any;
declare var $;

@Component({
  selector: 'app-selectagent',
  templateUrl: './selectagent.component.html',
  styleUrls: ['./selectagent.component.css']
})
export class SelectagentComponent implements OnInit {

  agentList: any[];
  agentTest: string;
  selectagent;
  invalidAgent: boolean;
  isAccepted: boolean = true;
  constructor(private agent: AgentService, private router: Router) {

    /*this.agent.getAllAgentList()
    .subscribe( result=>{
      this.agentList = result;
      $('.js-example-basic-single').select2();
    });*/
  }
    
  navigateagent(value) {
    if(value != "") {
      this.agent.getAgentDetails(value.agentid)
      .subscribe(result => {
        if(result) {
          this.router.navigate(['/page/', value.agentid]);
        }
        else {
          this.invalidAgent = true;
        }
      });
    }
    else {
      this.invalidAgent = true;
    }    
  }
  ngOnInit() {
    //checking if the user is already logged in!
    var agentid = localStorage.getItem('agent_url');
    if(agentid){
      this.router.navigate(["/page/", agentid]);
    }
  }

}
