import { CustomValidators } from './../../_helper/custom.validator';
import { AgentUser } from './../../_helper/agent-user';
import { Router } from '@angular/router';
import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

declare var populateCountries;
declare var swal;
declare var $;

@Component({
  selector: 'app-add-agents',
  templateUrl: './add-agents.component.html',
  styleUrls: ['./add-agents.component.css']
})
export class AddAgentsComponent implements OnInit {
  agentForm;
  addAgentMsg;
  addedAgent: boolean = false;
  isCity: boolean = false;
  isCounty: boolean = false;
  isCountry: boolean = false;  
  invalidPostcode: boolean = false;
  isLoading: boolean = true;
  bannercolor: string;
  categories = [
    { id: 'owner', name: 'Owner' },
    { id: 'serviceprovider', name: 'Service Provider' },
    { id: 'other', name: 'Other' },
  ];
  model = new AgentUser();
  constructor(private router: Router, private agentservice: AgentService, formbuilder: FormBuilder, private customvalidators: CustomValidators) { 
    this.agentForm = formbuilder.group({
      agentname: ['', Validators.required],
      agentusername: ['', [Validators.required, Validators.pattern("^\\S*$")],this.isUserUnique.bind(this)],
      agenttype: ['Service Provider'],
      agentemail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")],this.isEmailUnique.bind(this)],
      agentphone: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternatephone: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?#&])[A-Za-z\\d$@$!%*?#&]{8,}")]],
      confirmpassword: ['', Validators.required],
      county: [''],
      showpassword: [''],
      city: [''],
      postcode: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,2}[0-9R][0-9a-zA-Z]? [0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$")]],
      country: [''],
      address: ['', Validators.required]
    },
      {validator: this.customvalidators.MatchPassword } // your validation method
    );
  }

  showPassword() {
    let formData = this.agentForm.value;
    if(formData.showpassword == true) {
      $('input[name="password"]').attr('type','text');
    }
    else {
      $('input[name="password"]').attr('type','password');
    }   
  }

  getCity() {
    if(this.agentForm.get('postcode').valid) {
      this.agentservice.getCity(this.agentForm.value.postcode)
      .subscribe(data => {
        if(data.status == 200 ) {
          this.invalidPostcode = false;
          this.agentForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.agentForm.controls['county'].setValue(county);
          this.agentForm.controls['country'].setValue(data.result.country);
          this.isCity = true;
          this.isCounty = true;
          this.isCountry = true;                   
        }
        else {
         // console.log("Postcode Invalid");
          this.invalidPostcode = true;
        }
      });
    }

    //"http://maps.googleapis.com/maps/api/geocode/json?address="+this.issueForm.value.postcode+"&sensor=true";    
  }  
  
   goBack(){
    this.router.navigate(['/admin']);
  }

	isUserUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.agentservice.isUsernameExist(control.value)
        .subscribe(data => {
          if(data) {
            resolve ({'isUserUnique': true})
          }
          else {
            resolve(null)
          }
        });        
      }, 1000);
    });
    return q;
  }

	isEmailUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.agentservice.isEmailExist(control.value)
        .subscribe(data => {
          data = data
          if(data) {
            resolve ({'isEmailUnique': true})
          }
          else {
            resolve(null)
          }
        });        
      }, 1000);
    });
    return q;
  }

addAgents(){
    swal({
      title: 'Are you sure?',
      text: "You want to add this agent!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success alertboxmargin',
      cancelButtonClass: 'btn btn-danger alertboxmargin',
      buttonsStyling: false
    }).then(() => {
        if(this.isLoading) {
          swal({ onOpen: () => { swal.showLoading() } });
        }      
        this.agentservice.saveUser(this.agentForm.value)
        .subscribe(result => {
          this.isLoading = false;
          if (result['status'] == "success") {
            swal({
              title: 'Agent Added!',
              text: 'Agent added successfully.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
              }).then(() => { setTimeout( function () { location.reload(); },1000)});       
          }
          else if(result['status'] == "mail error") {
            swal({
              title: 'Agent Added!',
              text: 'Agent added successfully. But mail not sent.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
              }).then(() => { setTimeout( function () { location.reload(); },1000)});      
          }
          else {
            swal({
              title: 'Error!',
              text: 'Try again later.',
              type: 'error',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
              });            
          }
        });
    },
      function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'
      if (dismiss === 'cancel') {
        swal({
          title: 'Cancelled',
          text: 'No action performed!',
          type: 'error',
          confirmButtonColor: localStorage.getItem('admin_banner_color')
        });
      }
    })//then closing
  }
  ngOnInit() {
    this.bannercolor = localStorage.getItem('admin_banner_color');
  }
  
}
