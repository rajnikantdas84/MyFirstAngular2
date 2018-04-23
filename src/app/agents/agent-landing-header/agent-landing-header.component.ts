import { GlobalValues } from './../../_helper/global';
import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ActivatedRoute  } from '@angular/router';
import { NgStyle } from '@angular/common';


declare var $;

@Component({
  selector: 'agent-landing-header',
  templateUrl: './agent-landing-header.component.html',
  styleUrls: ['./agent-landing-header.component.css']
})
export class AgentLandingHeaderComponent implements OnInit {

  agentUsername;
  customerDisplayName = "";
  customerName;
  agenturl;
  defaultLanguage = "en-GB";
  agentDetails: any[];
  preferredLanguage1 = "et";
  preferredLanguage2 = "pl";
  preferredLanguage3 = "it";
  preferredLanguageName1 = "Estonian";
  preferredLanguageName2 = "Polish";
  preferredLanguageName3 = "Lithuanian";
  languageList: any[];
  siteurl: string;
  exitLogo = "";
  date = new Date();
  currentYear: any;
  bannercolor: string;

  constructor(private route: ActivatedRoute, private router: Router, private agent: AgentService) {

    this.siteurl = GlobalValues.SITEURL;
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

    
    // Get Language List
    this.agent.getLanguageList()
    .subscribe(data =>{
      if(data) {
        this.languageList = data;
      }
      else {
        console.log("Error in getting languages");
      }
    });

    // Checking if any particular language selected
    let language = this.route.snapshot.paramMap.get('language');
    if(language) {
      this.defaultLanguage = language;
    }
    $("#language_selector").val(this.defaultLanguage);
    $.cookie('googtrans', '/en/'+ this.defaultLanguage + ''); // Translating the page in a selected language.

    //console.log(this.customerDisplayName);
    // Get the agent username from URL

    this.agentUsername = this.route.snapshot.paramMap.get('username');
    this.agent.getPageSettings(this.agentUsername)
    .subscribe(result => {
      if(result) {
        this.agentDetails = result;
        this.preferredLanguage1 = this.agentDetails['preferred_language_1'];
        this.preferredLanguage2 = this.agentDetails['preferred_language_2'];
        this.preferredLanguage3 = this.agentDetails['preferred_language_3'];
        if(this.agentDetails['logo_image']) {
          this.exitLogo = this.agentDetails['logo_image'];
        }
        else {
          this.agent.getPageSettings('admin')
          .subscribe(data => {this.exitLogo = data['logo_image'];});          
        }
      }
      else {
        this.agent.getPageSettings('admin')
        .subscribe(result => {
          this.preferredLanguage1 = result['preferred_language_1'];
          this.preferredLanguage2 = result['preferred_language_2'];
          this.preferredLanguage3 = result['preferred_language_3'];          
        });
      }
      this.agent.getLanguageName(this.preferredLanguage1)
      .subscribe(result => { this.preferredLanguageName1 = result['name']});

      this.agent.getLanguageName(this.preferredLanguage2)
      .subscribe(result => { this.preferredLanguageName2 = result['name']});

      this.agent.getLanguageName(this.preferredLanguage3)
      .subscribe(result => { this.preferredLanguageName3 = result['name']});      
         
    });

    let email = localStorage.getItem('customer_key');
    if(email) {  
      this.customerDisplayName = localStorage.getItem('customer_name') ;
      this.agent.getTenantData(email)
        .subscribe(data => {
          this.customerName = data.name;
        });
    }
    this.agenturl =  localStorage.getItem('agent_url');
  }

  getLanguage($event) {
    this.defaultLanguage = $event.target.value;
    var path = '#/page/' + this.agenturl;
    var language_path = path + "/" + $event.target.value;
    //this.router.navigate([language_path]);
    //window.location.href=window.location.href+"/"+$event.target.value;
    window.location.hash=language_path;
    document.location.reload();

  }

  changeLanguage(value) {
    var path = '#/page/' + this.agenturl;
    var language_path = path + "/" + value;
    //this.router.navigate([language_path]);
    //window.location.href=window.location.href+"/"+value;
    window.location.hash=language_path;
    document.location.reload();    

  }
  //Tenant Logout
    logOutTenant() {
    localStorage.removeItem('customer_key');
    localStorage.removeItem('customer_name');
    localStorage.removeItem('customer_token');
   if(this.route.snapshot.paramMap.get('username')) {
    // window.location.reload();
     let path = 'page/'+ this.agenturl;
     this.router.navigate([path]);
   }
   else {
      let path = 'page/'+ this.agenturl;
      this.router.navigate([path]);
   }    
  }
  //Logging out the Agent
    logOutAgent() {
    localStorage.removeItem('agent_url');
    localStorage.removeItem('bannercolor');
    localStorage.removeItem('userid');
    this.router.navigate(['']);
   } 

}
