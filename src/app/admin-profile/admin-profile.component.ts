import { GlobalValues } from './../_helper/global';
import { AgentService } from './../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';

declare var populateCountries;
declare var swal;
declare var $;

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  editProfileForm;
  isChangePassword: boolean = false;
  county: string;
  updatedAgent: boolean = false;
  successMsg: string;
  isAdmin: boolean = false;
  geoCodeResult: any[];
  invalidPostcode: boolean = false;
  isLoading: boolean = true;

  categories = [
    { id: 'owner', name: 'Owner' },
    { id: 'serviceprovider', name: 'Service Provider' },
    { id: 'other', name: 'Other' },
  ];  
  constructor(private agent: AgentService, formbuilder: FormBuilder) {
    this.editProfileForm = formbuilder.group({
      name: [],
      username: [],
      email: [],
      address: ['', Validators.required],
      city: [''],
      phone: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternatephone: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      county: [],
      country: [],
      postcode: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,2}[0-9R][0-9a-zA-Z]? [0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$")]],
      password: [],
      agentid: '',
      changepassword: '',
      pageurl:'',
      showpassword: [''],
      auth_key: '',
      auth_token: ''
    });  
  }
  ngOnInit() {
    if(localStorage.getItem('auth_key') == "admin") {
      this.isAdmin = true;
    }
    this.getUserInfo(localStorage.getItem('auth_key'));    
    //populateCountries("country", "state");
    let banner_color = localStorage.getItem('admin_banner_color');
    $("#submit").css("background", banner_color);
    $("#submit").css("border-color", banner_color);
     
  }
  getUserInfo(username) {
    this.agent.getAgentDetails(username)
    .subscribe(data => {
      this.editProfileForm.controls['name'].setValue(data.name);
      this.editProfileForm.controls['username'].setValue(data.username);
      this.editProfileForm.controls['email'].setValue(data.email);
      this.editProfileForm.controls['phone'].setValue(data.phone);
      this.editProfileForm.controls['alternatephone'].setValue(data.alternate_number);
      this.editProfileForm.controls['address'].setValue(data.address);
      this.editProfileForm.controls['city'].setValue(data.city);
      this.editProfileForm.controls['postcode'].setValue(data.postcode);
      this.editProfileForm.controls['agentid'].setValue(data.id);
      this.editProfileForm.controls['country'].setValue(data.country);
      this.editProfileForm.controls['county'].setValue(data.county);
      //this.editProfileForm.controls['agenttype'].setValue(data.user_type);
      this.editProfileForm.controls['pageurl'].setValue(GlobalValues.SITEURL +'/page/'+ data.username);
      this.county = data.county; 
      var auth_token = localStorage.getItem('auth_token');
      auth_token= auth_token.replace(/\+/g, "%2b");
      this.editProfileForm.controls['auth_key'].setValue(localStorage.getItem('auth_key'));
      this.editProfileForm.controls['auth_token'].setValue(auth_token);
    });
  }

  updateProfile() {
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
        this.agent.updateInfo(this.editProfileForm.value)
        .subscribe(result => {
          this.isLoading = false;
          if (result == true) {
            swal({
              title: 'Updated!',
              text: 'Records has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)})            
          }
          else {
            swal({
              title: 'Error!',
              text: 'Try again later.',
              type: 'error'
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
    let formData = this.editProfileForm.value;
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
  getCity() {
    if(this.editProfileForm.get('postcode').valid) {
      this.agent.getCity(this.editProfileForm.value.postcode)
      .subscribe(data => {
        if(data.status == 200) {
          this.editProfileForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.editProfileForm.controls['county'].setValue(county);
          this.editProfileForm.controls['country'].setValue(data.result.country);          
        }
        else {
          console.log("Postcode Invalid");
        }
      });
    }
   
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
}
