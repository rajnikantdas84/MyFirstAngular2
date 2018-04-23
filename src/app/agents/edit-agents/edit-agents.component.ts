import { GlobalValues } from './../../_helper/global';
import { Component, OnInit } from '@angular/core';
import { AgentService } from './../../services/agent.service';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { CustomValidators } from './../../_helper/custom.validator';


declare var populateCountries;
declare var swal;
declare var $;

@Component({
  selector: 'app-edit-agents',
  templateUrl: './edit-agents.component.html',
  styleUrls: ['./edit-agents.component.css']
})
export class EditAgentsComponent implements OnInit {

  isChangePassword: boolean = false;
  updatedValue: any[];
  editAgentForm;
  result: any;
  invalidPostcode: boolean = false;
  agentDetails: any;
  agentstate: string;
  updatedAgent: boolean = false;
  isValueEmpty: boolean = false;
  isLoading: boolean = true;
  bannercolor: string;
  categories = [
    { id: 'owner', name: 'Owner' },
    { id: 'serviceprovider', name: 'Service Provider' },
    { id: 'other', name: 'Other' },
  ];
  constructor(private http: Http, private activateroute: ActivatedRoute, private agent: AgentService,formbuilder: FormBuilder, private customvalidators: CustomValidators) {
      this.editAgentForm = formbuilder.group({
      name: [''],
      username: [''],
      agenttype: ['', Validators.required],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternatephone: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      password: [''],
      county: [''],
      city: [''],
      postcode: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,2}[0-9R][0-9a-zA-Z]? [0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$")]],
      country: [''],
      address: ['', Validators.required],
      changepassword: [''],
      agentid: '',
      pageurl: '',
      showpassword: [''],
      auth_key: '',
      auth_token: ''       
    });   
  }

  ngOnInit() {
 
    this.result = this.activateroute.params.subscribe(params=> {
      this.loadAgentList(params['username']);
    });
    //populateCountries("country", "state");
    this.bannercolor = localStorage.getItem('admin_banner_color');
  }

  loadAgentList(username) {
    this.agent.getAgentDetails(username)
    .subscribe(data => {
        this.editAgentForm.controls['name'].setValue(data.name);
        this.editAgentForm.controls['username'].setValue(data.username);
        this.editAgentForm.controls['email'].setValue(data.email);
        this.editAgentForm.controls['phone'].setValue(data.phone);
        this.editAgentForm.controls['alternatephone'].setValue(data.alternate_number);
        this.editAgentForm.controls['address'].setValue(data.address);
        this.editAgentForm.controls['city'].setValue(data.city);
        this.editAgentForm.controls['postcode'].setValue(data.postcode);
        this.editAgentForm.controls['agentid'].setValue(data.id);
        this.editAgentForm.controls['country'].setValue(data.country);
        this.editAgentForm.controls['county'].setValue(data.county);
        this.editAgentForm.controls['agenttype'].setValue(data.user_type);
        this.editAgentForm.controls['pageurl'].setValue(GlobalValues.SITEURL +'/page/'+ data.username);
        this.agentstate = data.state;
        var auth_token = localStorage.getItem('auth_token');
        auth_token= auth_token.replace(/\+/g, "%2b");
        this.editAgentForm.controls['auth_key'].setValue(localStorage.getItem('auth_key'));
        this.editAgentForm.controls['auth_token'].setValue(auth_token);        
    });
  }

  updateAgents() {
    swal({
      title: 'Are you sure?',
      text: "You want to update the records!",
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
        this.agent.updateInfo(this.editAgentForm.value)
        .subscribe(result => {
          this.isLoading = false;
          if (result == true) {
            swal({
              title: 'Updated!',
              text: 'Agent records has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)})            
          }
          else {
            swal({
              title: 'Error!',
              text: 'Try again later.',
              type: 'error',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)})                 
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

  updatePassword(){
    let formData = this.editAgentForm.value;
    //console.log(this.editAgentForm.value.agenttype);
    if(formData.changepassword == true) {
      this.isChangePassword = true;
      const ctrl: FormControl = this.editAgentForm.get('password').enable();
      
      this.editAgentForm.get('password').setValidators([Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?#&])[A-Za-z\\d$@$!%*?#&]{8,}")]);
      const controlErrors: ValidationErrors = this.editAgentForm.get('password').errors;
      console.log(controlErrors);
    }      
    else {
      this.isChangePassword = false;  
      const ctrl: FormControl = this.editAgentForm.get('password').disable();
    }       
  }

  getCity() {
    if(this.editAgentForm.get('postcode').valid) {
      this.agent.getCity(this.editAgentForm.value.postcode)
      .subscribe(data => {
        if(data.status == 200) {
          this.invalidPostcode = false;
          this.editAgentForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.editAgentForm.controls['county'].setValue(county);
          this.editAgentForm.controls['country'].setValue(data.result.country);          
        }
        else {
          this.invalidPostcode = true;
          console.log("Postcode Invalid");
        }
      });
    } 
  }

  showPassword() {
    let formData = this.editAgentForm.value;
    if(formData.showpassword == true) {
      $('input[name="password"]').attr('type','text');
    }
    else {
      $('input[name="password"]').attr('type','password');
    }   
  }  
}
