import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { NgStyle } from '@angular/common';

declare var populateCountries;
declare var swal;
declare var $;

@Component({
  selector: 'app-tenant-account-info',
  templateUrl: './tenant-account-info.component.html',
  styleUrls: ['./tenant-account-info.component.css']
})
export class TenantAccountInfoComponent implements OnInit {
  editProfileForm;
  isChangePassword: boolean = false;
  state: string;
  tenantName;
  agentUsername;
  isLoading: boolean = true;
  bannercolor: string;
  constructor(private agent: AgentService, formbuilder: FormBuilder) {
    this.editProfileForm = formbuilder.group({
      name: ['',Validators.required],
      email: [],
      address: ['', Validators.required],
      city: [''],
      phone: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternate_number: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      county: [],
      country: [],
      postcode: ['', [Validators.required, Validators.pattern("^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$")]],
      password: [],
      changepassword: '',
      showpassword: '',
      image: [''],
      agentuser: ['']
    });    
    
   }
  onMouseOut($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
    //console.log("mouseout");
     //console.log($value);

  }
  onMouseOver($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
     //console.log("mouseover");
      //console.log($value);
  }
  ngOnInit() {
    this.bannercolor = localStorage.getItem('bannercolor');
    let email = localStorage.getItem('customer_key');
    this.getTenantDetails(email);
    //populateCountries("country", "state");
    this.agentUsername =  localStorage.getItem('agent_url');
    $(function () {
      var i=182;
      $('#js-heightControl').css('min-height', $(window).height() - i+'px');
    });

  }
  showPassword() {
    let formData = this.editProfileForm.value;
    if(formData.showpassword == true) {
      $('input[name="password"]').attr('type','text');
    }
    else {
      $('input[name="password"]').attr('type','password');
    }   
  }

  getCity() {
    if(this.editProfileForm.get('postcode').valid) {
      this.agent.getCity(this.editProfileForm.value.postcode)
      .subscribe(data => {
       // console.log(data);
        if(data.status == 200) {
          this.editProfileForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.editProfileForm.controls['county'].setValue(county);
          this.editProfileForm.controls['country'].setValue(data.result.country);
        }
      });
    }
    else {
      console.log("Postcode Invalid");
    }

  }
  getTenantDetails(email) {
    this.agent.getTenantData(email)
    .subscribe(data => {
      this.editProfileForm.controls['name'].setValue(data.name);
      this.editProfileForm.controls['email'].setValue(data.email);
      this.editProfileForm.controls['phone'].setValue(data.phone);
      this.editProfileForm.controls['alternate_number'].setValue(data.alternate_number);
      this.editProfileForm.controls['address'].setValue(data.address);
      this.editProfileForm.controls['city'].setValue(data.city);
      this.editProfileForm.controls['postcode'].setValue(data.postcode);
      this.editProfileForm.controls['agentuser'].setValue(data.agentuser);
      this.editProfileForm.controls['country'].setValue(data.country);
      this.editProfileForm.controls['county'].setValue(data.county);
      this.editProfileForm.controls['image'].setValue(data.image);
      this.tenantName = data.name;
      //this.agentUsername = data.agentuser;
      localStorage.setItem('customer_name',data.name);
      this.state = data.state;     
    });
  }

  updatePassword(){
    let formData = this.editProfileForm.value;
   // console.log(this.editProfileForm.value);
    if(formData.changepassword == true) {
      this.isChangePassword = true;
      const ctrl: FormControl = this.editProfileForm.get('password').enable();
      this.editProfileForm.get('password').setValidators([Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?#&])[A-Za-z\\d$@$!%*?#&]{8,}")]);
    }      
    else {
      this.isChangePassword = false;  
      const ctrl: FormControl = this.editProfileForm.get('password').disable();
    }       
  }

  updateProfile() {
    swal({
      title: 'Are you sure?',
      text: "You want to update the details!",
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
        this.agent.updateTenantInfo(this.editProfileForm.value)
        .subscribe(result => {
          this.isLoading = false;
          if (result['status'] == "success") {
            //this.getTenantDetails(this.editProfileForm.value.email);
           // this.isLoading = true;
            swal({
              title: 'Profile Updated!',
              text: 'Details has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('bannercolor')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});        
          }
          else if(result['status'] == "mail error") {
           // this.getTenantDetails(this.editProfileForm.value.email);
           // this.isLoading = true;
            swal({
              title: 'Profile Updated!',
              text: 'Details has been updated. Mail not sent.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('bannercolor')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});
          }
          else {
            swal({
              title: 'Error!',
              text: 'Try again later.',
              type: 'error',
              confirmButtonColor: localStorage.getItem('bannercolor')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});        
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
          confirmButtonColor: localStorage.getItem('bannercolor')
        });
      }
    })//then closing    
  }  

}
