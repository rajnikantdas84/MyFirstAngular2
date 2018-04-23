import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from './../../_helper/custom.validator';
import { AgentService } from './../../services/agent.service';
import { ActivatedRouteSnapshot, Router, ActivatedRoute  } from '@angular/router';
import { NgStyle } from '@angular/common';

declare var populateCountries;
declare var swal: any;
declare var $;

@Component({
  selector: 'app-tenant-registration',
  templateUrl: './tenant-registration.component.html',
  styleUrls: ['./tenant-registration.component.css']
})
export class TenantRegistrationComponent implements OnInit {
  tenantSignUp;
  addTenantMsg = "";
  isFormValid: boolean = true;
  errorMsg;
  agentusername;
  bannercolor: string;
  isCity: boolean = false;
  isCounty: boolean = false;
  isCountry: boolean = false;
  invalidPostcode: boolean = false;
  isLoading: boolean = true;

  constructor(private formbuilder: FormBuilder, private customvalidators: CustomValidators, private agentservice: AgentService,private route: ActivatedRoute,private _router: Router) {
    this.tenantSignUp = formbuilder.group({
        fullname: ['',Validators.required],
        email:  ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")],this.isEmailUnique.bind(this)],
        password:  ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?#&])[A-Za-z\\d$@$!%*?#&]{8,}")]],
        confirmpassword:  ['',Validators.required],
        contact:     ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
        alternatephone:  ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
        address:     ['',Validators.required],
        city:   [''],
        country:  [''],
        county: [''],
        agentuser: [''],
        showpassword: [''],
        postcode: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,2}[0-9R][0-9a-zA-Z]? [0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$")]],
        confirmterm: ['', [Validators.required, Validators.pattern('true')]]
      },
        {validator: this.customvalidators.MatchPassword } // your validation method
      );
   }

	isEmailUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.agentservice.isCustomerEmailExist(control.value)
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
  ngOnInit() {
    //populateCountries("country","state");
    this.bannercolor = localStorage.getItem('bannercolor');
    this.agentusername = this.route.snapshot.paramMap.get('agentuser');
    this.tenantSignUp.controls['agentuser'].setValue(this.agentusername);
  }

  getCity() {
    if(this.tenantSignUp.get('postcode').valid) {
      this.agentservice.getCity(this.tenantSignUp.value.postcode)
      .subscribe(data => {
       // console.log(data);
        if(data.status == 200) {
          this.invalidPostcode = false;
          this.tenantSignUp.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.region : data.result.admin_county;
          this.tenantSignUp.controls['county'].setValue(county);
          this.tenantSignUp.controls['country'].setValue(data.result.country);
          this.isCity = true;
          this.isCounty = true;
          this.isCountry = true;                 
        }
        else {
          this.invalidPostcode = true;
          console.log("Postcode is invalid");
        }
      });
    }
    else {
      this.invalidPostcode = true;
      console.log("Postcode is invalid");
    }

  }
 redirectUsertoDashboard() {
  let path = '/tenant-dashboard';
  this._router.navigate([path]);
}
successDialog()
{
  swal({
        title: 'Registered Successfully',
        text: 'Your account has been created.',
        type: 'success',
        confirmButtonColor: localStorage.getItem('bannercolor')
      }).then(() => { 
        setTimeout( function () {},1000);
        this.redirectUsertoDashboard();
      });
 
}
Email_Error_SuccessDialog()
{
  swal({
        title: 'Registered Successfully',
        text: 'Email not sent!.',
        type: 'success',
        confirmButtonColor: localStorage.getItem('bannercolor')
      }).then(() => { 
        setTimeout( function () {},1000);
        this.redirectUsertoDashboard();        
      })
 
}

  showPassword() {
    let formData = this.tenantSignUp.value;
    if(formData.showpassword == true) {
      $('input[name="password"]').attr('type','text');
    }
    else {
      $('input[name="password"]').attr('type','password');
    }   
  }
  userSignup() { 
  //  console.log(this.tenantSignUp.value); console.log(this.tenantSignUp.value.email);
    let formData = this.tenantSignUp.value;    
    if(this.tenantSignUp.invalid) {
      this.isFormValid = false;
      window.scrollTo(0,0);
    }
   else {
      if(this.isLoading) {
        swal({ onOpen: () => { swal.showLoading() } });
      }     
      this.agentservice.saveTenant(this.tenantSignUp.value)
      .subscribe(result => {
        this.isLoading = false;
        if (result['status'] == "success") {
          localStorage.setItem('customer_key', this.tenantSignUp.value.email);
          localStorage.setItem('customer_name', this.tenantSignUp.value.fullname);
          localStorage.setItem('customer_token',result['token']);
          this.successDialog();
        }
        else if(result['status'] == "mail error") {
          localStorage.setItem('customer_key', this.tenantSignUp.value.email);
          localStorage.setItem('customer_name', this.tenantSignUp.value.fullname);
          localStorage.setItem('customer_token',result['token']);          
          this.Email_Error_SuccessDialog();
        }
        else {
          this.errorMsg = "Something went wrong!";
          swal({ title: 'Error!', text: 'Please try again later.',type: 'error', confirmButtonColor: localStorage.getItem('bannercolor')})
        }        
      });      
    }   
  }
}
