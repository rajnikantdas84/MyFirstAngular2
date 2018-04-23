import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';

declare var populateCountries;
declare var swal;
declare var $;

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  editCustomerForm;
  result: any;
  customerDetails: any;
  customerState: string;
  isChangePassword: boolean = false;
  dialogMsg = "Customer Records Updated Successfully.";
  dialogClass = "green";
  invalidPostcode: boolean = false;
  isLoading: boolean = true;
  bannercolor: string;

  constructor(private activateroute: ActivatedRoute, private agent: AgentService,formbuilder: FormBuilder) {
      this.editCustomerForm = formbuilder.group({
      name: [''],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternatephone: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      county: [''],
      city: [''],
      postcode: ['', [Validators.required, Validators.pattern("^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$")]],
      country: [''],
      address: ['', Validators.required],
      changepassword: [''],
      updatepassword: [''],
      status: [''],
      showpassword: ['']
    });    
   }

  ngOnInit() {
    this.result = this.activateroute.params.subscribe(params=> {
      this.loadDetails(params['id']);
    });
    //populateCountries("country", "state");
    this.bannercolor = localStorage.getItem('admin_banner_color');
  }
  loadDetails(id) {
    this.agent.getCustomerDetails(id)
    .subscribe(data => {
        this.editCustomerForm.controls['name'].setValue(data.name);
        this.editCustomerForm.controls['email'].setValue(data.email);
        this.editCustomerForm.controls['phone'].setValue(data.phone);
        this.editCustomerForm.controls['alternatephone'].setValue(data.alternate_number);
        this.editCustomerForm.controls['address'].setValue(data.address);
        this.editCustomerForm.controls['city'].setValue(data.city);
        this.editCustomerForm.controls['postcode'].setValue(data.postcode);
        this.editCustomerForm.controls['country'].setValue(data.country);
        this.editCustomerForm.controls['county'].setValue(data.county);
        this.customerState = data.state;
    });    
  }
  getCity() {
    if(this.editCustomerForm.get('postcode').valid) {
      this.agent.getCity(this.editCustomerForm.value.postcode)
      .subscribe(data => {
        //console.log(data);
        if(data.status == 200) {
          this.invalidPostcode = false;
          this.editCustomerForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.editCustomerForm.controls['county'].setValue(county);
          this.editCustomerForm.controls['country'].setValue(data.result.country);          
        }
        else {
          this.invalidPostcode = true;
          console.log("Postcode Invalid");
        }
      });
    }
    else {
      this.invalidPostcode = true;
      console.log("Postcode Invalid");
    }
    //"http://maps.googleapis.com/maps/api/geocode/json?address="+this.issueForm.value.postcode+"&sensor=true";    
  }
  updateCustomer() {
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
        this.agent.updateCustomerInfo(this.editCustomerForm.value)
        .subscribe(result => {
          this.isLoading = false;
          if (result['status'] == "success") {
            swal({
              title: 'Customer Records Updated!',
              text: 'Customer records has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});       
          }
          else if(result['status'] == "mail error") {
            swal({
              title: 'Customer Records Updated!',
              text: 'Customer records has been updated. Mail not sent.',
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
          confirmButtonColor: localStorage.getItem('admin_banner_color')
        });
      }
    })//then closing 
  }

  updatePassword(){
    let formData = this.editCustomerForm.value;
    if(formData.updatepassword == true) {
      this.isChangePassword = true;
      const ctrl: FormControl = this.editCustomerForm.get('changepassword').enable();
      this.editCustomerForm.get('changepassword').setValidators([Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?#&])[A-Za-z\\d$@$!%*?#&]{8,}")]);
    }      
    else {
      this.isChangePassword = false;
      this.editCustomerForm.controls['showpassword'].setValue('false');
      const ctrl: FormControl = this.editCustomerForm.get('changepassword').disable();
    }       
  }

  showPassword() {
    let formData = this.editCustomerForm.value;
    if(formData.showpassword == true) {
      $('input[name="changepassword"]').attr('type','text');
    }
    else {
      $('input[name="changepassword"]').attr('type','password');
    }   
  }

}
