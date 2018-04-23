import { GlobalValues } from './../../_helper/global';
import { AdminLoginComponent } from './../../admin-login/admin-login.component';
import { Response } from '@angular/http';
import { Location, NgStyle } from '@angular/common';
import { Output } from '@angular/core/src/metadata/directives';
import { AgentService } from './../../services/agent.service';
import { ActivatedRouteSnapshot, Router, ActivatedRoute  } from '@angular/router';
import { Component, OnInit, NgModule ,NO_ERRORS_SCHEMA,  AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DropzoneModule, DropzoneConfig, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

declare var swal: any;
declare var $;
@Component({
  selector: 'agent-landing',
  templateUrl: './agent-landing.component.html',
  styleUrls: ['./agent-landing.component.css']
})
export class AgentLandingComponent implements OnInit {
  issueForm;
  step10: any;
  categories: any[];
  currentDate: any;
  selected :any;
  isFormValid: boolean = true;
  ispostcode: boolean = true;
  isaddress: boolean = true;
  isfullname: boolean = true;
  iscategory: boolean = true;
  isdescription: boolean = true;
  isemail: boolean = true;
  isconfirm: boolean = true;
  isphone: boolean = true;
  invalidPostcode: boolean = false;
  errorMsg;
  successMsg;
  issueid;
  self_fix = "";
  issueImage2: boolean = false;
  issueImage3: boolean = false;
  imagename: any = "";
  showThumb: boolean = false;
  public uploadedImages = [];
  testimage = "";
  private uploadResult:any = null;
  public file:any;
  public fileItem: any;
  loggedUser: boolean = false;
  isAlternateNumber: boolean = false;
  isCity: boolean = false;
  isCounty: boolean = false;
  isCountry: boolean = false;
  defaultLanguage = "en-GB";
  parentCatList: any[] = [];
  categoryList: any[] = [];
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;
  nosubcat: boolean = false;
  previousCatId = "";
  currentCatPage = "";
  previousCatPage = "";
  previousCat2: any[];
  previousCat: any[];
  parentCat: any[];
  previousCatPageLevel = "";
  clickedCat: boolean = false;
  isCatlevel2: boolean = false;
  catlevel2: any;
  isSubcat: boolean = false;
  isSubcat2: boolean = false;
  clickedcatlevel1: boolean = false;
  clickedcatlevel2: boolean = false;
  clickedcatlevel3: boolean = false;
  subcat1: any;
  subcat2: any;
  accesspropertywithme: boolean = false;
  removedImages: any = "";
  finalImgArr: any[];
  issueImageName1 = "";
  issueImageName2 = "";
  issueImageName3 = "";
  issueimagefirst_config: DropzoneConfigInterface;
  issueimagesecond_config: DropzoneConfigInterface;
  issueimagethird_config: DropzoneConfigInterface;
  isLoading: boolean = true;
  bannercolor: string;
  hovercolor: string;
  siteurl: string;
  agentUsername = "";
  disabledArray: any[] = [];

  constructor(private route: ActivatedRoute,private agent: AgentService, formbuilder: FormBuilder, private router: Router, private _location: Location) {

    
    let agent_url = this.route.snapshot.paramMap.get('username');
    this.agentUsername = agent_url;
    //console.log(this.agentUsername);
    this.agent.getPageSettings(agent_url)
    .subscribe(result => {
        this.bannercolor = result.banner_color;
    });     
    //this.bannercolor = localStorage.getItem('bannercolor');
    this.siteurl = GlobalValues.SITEURL;
  //  this.loadCategories(); //Load Issue Categories from DB
    this.currentDate = new Date();
    this.issueForm = formbuilder.group({
      issueimage1: [''],
      issueimage2: [''],
      issueimage3: [''],
      selectedcategory: ['', Validators.required],
      selectedcategoryname: [''],
      postcode: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,2}[0-9R][0-9a-zA-Z]? [0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$")]],
      address: ['', Validators.required],
      tenantid: [''],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")]],
      contactnumber: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternatenumber: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      issuedescription: ['', Validators.required],
      manufacturer: [''],
      productmodel: [''],
      productserial: [''],
      accessproperty: [''],
      visitdatetime: [''],
      agentname: [''],
      agentid: [''],
      agentphone: [''],
      agentemail: [''],
      customertype: [''],      
      city:[''],
      county:[''],
      country:[''],
      vulnerableproperty: [''],
      confirmterm: ['', [Validators.required, Validators.pattern('true')]],
      issueadditionalnotes: [''],
      agentusername: ['']
    });

  }
  getCity() {
    if(this.issueForm.get('postcode').valid) { 
      this.agent.getCity(this.issueForm.value.postcode)
      .subscribe(data => {
        if(data.status == 200 ) {
          this.invalidPostcode = false;
         // console.log(data.result);
          this.issueForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.issueForm.controls['county'].setValue(county);
          this.issueForm.controls['country'].setValue(data.result.country);
          this.isCity = true;
          this.isCounty = true;
          this.isCountry = true;
        }
        else { 
          this.invalidPostcode = true;
         // console.log("Postcode Invalid");
        }
      });
    }
    else {
      this.invalidPostcode = true;
     // console.log("Postcode Invalid");
    }
    //"http://maps.googleapis.com/maps/api/geocode/json?address="+this.issueForm.value.postcode+"&sensor=true";    
  }  
    accessProperty() {
      if($('#accesspropertywithme').is(':checked')) {
       // console.log('dateshow');
        this.accesspropertywithme = true;
        const ctrl: FormControl = this.issueForm.get('visitdatetime').enable();
        this.issueForm.controls['accessproperty'].setValue("1");
        //this.issueForm.get('visitdatetime').setValidators(Validators.required);
      }
      else {
       // console.log('nodateshow');
        this.accesspropertywithme = false;
        this.issueForm.controls['accessproperty'].setValue("");
        const ctrl: FormControl = this.issueForm.get('visitdatetime').disable();
      }
    }
    backHome() {
      //location.reload();
      this.isSubcat = false;
      this.nosubcat = false;
      this.clickedCat = false;
      this.isSubcat2 = false;
      this.previousCatPageLevel = "";
      this.issueForm.controls['issuedescription'].setValue('');
      this.issueForm.reset();
    }
    backClicked() {
        this._location.back();
    }
    backPage(level) {
     // console.log("Back Clicked");
     // console.log(this.previousCatPageLevel);
     // console.log("Level " + level );
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;       
      if(level == "1") {
        this.isSubcat2 = false;
        this.nosubcat = false;
        this.previousCatPageLevel = "";
        //console.log(this.previousCat);
        this.selectsubcat1(this.previousCat);      
      }
      else if(level == "2") {
        this.isSubcat = true;
        this.isSubcat2 = true;
        this.nosubcat = false;
        //console.log(this.previousCat2);
        this.selectsubcat3(this.previousCat2);
        this.previousCatPageLevel = "1";   
      }
      else if(level == "3") {
        this.isSubcat = true;
        this.isSubcat2 = true;
        this.nosubcat = false;
        //console.log(this.previousCat2);
        this.selectsubcat2(this.previousCat2);
        this.previousCatPageLevel = "2";        
      }
      else {
        //console.log("here");
        this.isSubcat = false;
        this.nosubcat = false;
        this.clickedCat = false;
      }

    }
  $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
  // Level 1 category list
  selectsubcat1(item) {
    //console.log("subcat1 "+ item.cat_id);
    this.agent.getSubCategories(item.cat_id)
    .subscribe(result =>{
        if(result) {
          let FinalCatArray: any[] = [];
          for(let entry of result) {
            let value: any;
            value = this.checkDisabledArray(entry.cat_id);
            if(value == 1) {
              FinalCatArray.push(entry);
            }            
          }
          if(FinalCatArray.length>0) {
            this.isSubcat = true;
            this.subcat1 = FinalCatArray;
            this.clickedCat = true;          
            this.currentCatPage = item.cat_name;
            this.previousCatPage = "Back";
            this.previousCat = item;
            this.parentCat = item;
           // console.log(this.parentCat);
           // console.log("selected_issue: " + item.cat_id);
            this.step2 = false;
            this.step3 = false;
            this.step4 = false;
            this.step5 = false;
            this.self_fix = "";
          }
          else {
            //console.log("selected_issue: " + item.cat_id);
            this.currentCatPage = item.cat_name;
            this.previousCatPage = "Back";
            this.nosubcat = true;
            this.isSubcat = false;
            this.clickedCat = true;
            if(item.cat_description != null) {
              this.self_fix = item.cat_description;
            }
            
            if(item.notice) {
              swal({
                title: 'Warning!',
                customClass: "custom-warning",
                text: item.notice ,
                type: 'warning',
                confirmButtonColor: localStorage.getItem('bannercolor')
              });
            }              
            this.issueForm.controls['selectedcategory'].setValue(item.cat_id);
            this.issueForm.controls['selectedcategoryname'].setValue(item.cat_name);            
          }        
        }
        else { 
          //console.log("selected_issue: " + item.cat_id);
          this.currentCatPage = item.cat_name;
          this.previousCatPage = "Back";
          this.nosubcat = true;
          this.isSubcat = false;
          this.clickedCat = true;
          if(item.cat_description != null) {
            this.self_fix = item.cat_description;
          }
          
          if(item.notice) {
            swal({
              title: 'Warning!',
              customClass: "custom-warning",
              text: item.notice ,
              type: 'warning',
              confirmButtonColor: localStorage.getItem('bannercolor')
             });
          }              
          this.issueForm.controls['selectedcategory'].setValue(item.cat_id);
          this.issueForm.controls['selectedcategoryname'].setValue(item.cat_name);
        }
    });
  }
  // Level 2 category list
  selectsubcat2(item) { 
   // console.log("subcat2 " + item.cat_id);
    this.agent.getSubCategories(item.cat_id)
    .subscribe((result) =>{
        if(result) {
          let FinalCatArray: any[] = [];
          for(let entry of result) {
            let value: any;
            value = this.checkDisabledArray(entry.cat_id);
            if(value == 1) {
              FinalCatArray.push(entry);
            }            
          }
          if(FinalCatArray.length>0) {
            this.isSubcat = true;
            this.isSubcat2 = true;
            this.subcat2 = FinalCatArray;
            this.clickedCat = true;
            this.currentCatPage = item.cat_name;
            this.previousCatPage = "Back";
            this.previousCat2 = item;
            this.previousCatPageLevel = "1";
           // console.log("selected_issue3: " + item.cat_id);
            this.step2 = false;
            this.step3 = false;
            this.step4 = false;
            this.step5 = false;  
            this.self_fix = "";
          }
          else {
           // console.log("selected_issue2: " + item.cat_id);
            this.currentCatPage = item.cat_name;
            this.previousCatPage = "Back";
            this.nosubcat = true;
            this.isSubcat = true;
            this.clickedCat = true;
            this.isSubcat2 = false;
            if(item.cat_description != null) {
              this.self_fix = item.cat_description;
            }
            this.previousCatPageLevel = "1";
            if(item.notice) {
              swal({
                title: 'Warning!',
                customClass: "custom-warning",
                text: item.notice ,
                type: 'warning',
                confirmButtonColor: localStorage.getItem('bannercolor')
              });
            }   
            this.issueForm.controls['selectedcategory'].setValue(item.cat_id);
            this.issueForm.controls['selectedcategoryname'].setValue(item.cat_name);            
          }     
        }
        else { 
         // console.log("selected_issue: " + item.cat_id);
          this.currentCatPage = item.cat_name;
          this.previousCatPage = "Back";
          this.nosubcat = true;
          this.isSubcat = true;
          this.clickedCat = true;
          this.isSubcat2 = false;
          if(item.cat_description != null) {
            this.self_fix = item.cat_description;
          }
          this.previousCatPageLevel = "1";
          if(item.notice) {
            swal({
              title: 'Warning!',
              customClass: "custom-warning",
              text: item.notice ,
              type: 'warning',
              confirmButtonColor: localStorage.getItem('bannercolor')  
             });
          }
          this.issueForm.controls['selectedcategory'].setValue(item.cat_id);
          this.issueForm.controls['selectedcategoryname'].setValue(item.cat_name);
        }
    });
  }
    // Level 3 category list
  selectsubcat3(item) { 
   // console.log("subcat3 " + item.cat_id);   
    this.agent.getSubCategories(item.cat_id)
    .subscribe(result =>{
        if(result) {
          let FinalCatArray: any[] = [];
          for(let entry of result) {
            let value: any;
            value = this.checkDisabledArray(entry.cat_id);
            if(value == 1) {
              FinalCatArray.push(entry);
            }            
          }
          if(FinalCatArray.length>0) {
            this.isSubcat = false;
            this.clickedCat = true;
            this.currentCatPage = item.cat_name;
            this.previousCatPage = "Back";
            this.previousCat = item;
            this.previousCatPageLevel = "2"; 
           // console.log("selected_issue: " + item.cat_id);
            this.step2 = false;
            this.step3 = false;
            this.step4 = false;
            this.step5 = false;
            this.self_fix = "";
          }
          else {
           // console.log("selected_issue: " + item.cat_id);
            this.currentCatPage = item.cat_name;
            this.previousCatPage = "Back";
            this.nosubcat = true;
            this.clickedCat = true;
            this.isSubcat2 = true;
            this.isSubcat = true;
            if(item.cat_description != null) {
              this.self_fix = item.cat_description;
            }
            this.previousCatPageLevel = "3";
            if(item.notice) {
              swal({
                title: 'Warning!',
                customClass: "custom-warning",
                text: item.notice ,
                type: 'warning',
                confirmButtonColor: localStorage.getItem('bannercolor')
              });
            }          
            this.issueForm.controls['selectedcategory'].setValue(item.cat_id);
            this.issueForm.controls['selectedcategoryname'].setValue(item.cat_name);            
          }
            
        }
        else { 
         // console.log("selected_issue: " + item.cat_id);
          this.currentCatPage = item.cat_name;
          this.previousCatPage = "Back";
          this.nosubcat = true;
          this.clickedCat = true;
          this.isSubcat2 = true;
          this.isSubcat = true;
          if(item.cat_description != null) {
            this.self_fix = item.cat_description;
          }
          this.previousCatPageLevel = "3";
          if(item.notice) {
            swal({
              title: 'Warning!',
              customClass: "custom-warning",
              text: item.notice ,
              type: 'warning',
              confirmButtonColor: localStorage.getItem('bannercolor')
             });
          }          
          this.issueForm.controls['selectedcategory'].setValue(item.cat_id);
          this.issueForm.controls['selectedcategoryname'].setValue(item.cat_name);
        }
    });
  }


  onRemoveFirst($event) {
 // console.log("onRemoveFirst($event)", $event);
  this.issueForm.controls['issueimage1'].setValue("");
  }
  onUploadSuccessFirst($event) {
    // console.log("onUploadSuccessFirst($event)", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.issueImageName1 = data.generatedName;
     this.issueForm.controls['issueimage1'].setValue(this.issueImageName1);
  }
  onUploadErrorFirst($event) {
    //console.log("onUploadErrorFirst($event)", $event);
      this.issueForm.controls['issueimage1'].setValue("");
     // this.imagename = "";  
      swal({
        title: 'Error!',
        text: $event[1],
        type: 'error'
        }).then(() => { setTimeout( function () { location.reload(); },300)}) 
  }
  onUploadCanceledFirst($event) {
    //console.log("onUploadCanceledFirst($event)", $event);
    this.issueForm.controls['issueimage1'].setValue("");    
  }
  onDropFirst($event) {
    // console.log("Just dropped", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.issueImageName1 = data.generatedName;
     this.issueForm.controls['issueimage1'].setValue(this.issueImageName1);    
  }

  // Second image functions

  onRemoveSecond($event) {
    //console.log("RemoveSecond");
     this.issueForm.controls['issueimage2'].setValue("");

  }
  onUploadSuccessSecond($event) {
    //$event returns [File, Object, ProgressEvent];
    // console.log("onUploadSuccessSecond", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.issueImageName2 = data.generatedName;
     this.issueForm.controls['issueimage2'].setValue(this.issueImageName2);
  }
  onUploadErrorSecond($event) {
  //  console.log("onUploadErrorSecond($event)", $event);
    this.issueForm.controls['issueimage2'].setValue("");
     // this.imagename = "";  
      swal({
        title: 'Error!',
        text: $event[1],
        type: 'error'
        }).then(() => { setTimeout( function () { location.reload(); },300)}) 
  }
  onUploadCanceledSecond($event) {
   // console.log("onUploadCanceledFirst($event)", $event);
     this.issueForm.controls['issueimage2'].setValue("");    
  }
  onDropSecond($event) {
    // console.log("Just dropped", $event);
    //$event returns [File, Object, ProgressEvent];
     let data =JSON.parse($event[1].toString()); // to parse the json string.
    this.issueImageName2 = data.generatedName;
     this.issueForm.controls['issueimage2'].setValue(this.issueImageName2);   
  }

  // Second image functions end

  // Third image functions
  onRemoveThird($event) {
   // console.log("RemoveThird Start");
    this.issueForm.controls['issueimage3'].setValue("");
  }
  onUploadSuccessThird($event) {
    // console.log("onUploadSuccessThird($event)", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.issueImageName3 = data.generatedName;
     this.issueForm.controls['issueimage3'].setValue(this.issueImageName3);
  }
  onUploadErrorThird($event) {
   // console.log("onUploadErrorThird($event)", $event);
    this.issueForm.controls['issueimage3'].setValue("");  
      swal({
        title: 'Error!',
        text: $event[1],
        type: 'error'
        }).then(() => { setTimeout( function () { location.reload(); },300)}) 
  }
  onUploadCanceledThird($event) {
   // console.log("onUploadCanceledThird($event)", $event);
    this.issueForm.controls['issueimage3'].setValue("");    
  }
  onDropThird($event) {
   //  console.log("Just dropped", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.issueImageName3 = data.generatedName;
     this.issueForm.controls['issueimage3'].setValue(this.issueImageName3);    
  }  

  // Third image function end
  checkAdditionalNotes() {
   // console.log(this.issueForm.value['issueadditionalnotes']);
    if(this.issueForm.get('issueadditionalnotes').valid) {
      this.step2 = true;
     // this.step1 = false;
      $(".slide1").find('i').addClass('ion-plus');
      $(".slide1").find('i').removeClass('ion-minus');
     $(".toggle-content1").slideUp('fast');
    }
    else {
      console.log("continue with step 1");
      this.step2 = false;
    }
  }
  goNext(step) {
    if(step == "step2") {
      this.step2 = true;
      $(".slide1").find('i').addClass('ion-plus');
      $(".slide1").find('i').removeClass('ion-minus');      
      $(".toggle-content1").slideUp('fast');

      $(".slide2").find('i').addClass('ion-minus');
      $(".slide2").find('i').removeClass('ion-plus');      
      $(".toggle-content2").slideDown('fast');
    }
    else if(step == "step3"){
      this.step3 = true;
      $(".slide2").find('i').addClass('ion-plus');
      $(".slide2").find('i').removeClass('ion-minus');      
      $(".toggle-content2").slideUp('fast');
    }
    else if(step == "step4") {
      this.step4 = true;
      $(".slide3").find('i').addClass('ion-plus');
      $(".slide3").find('i').removeClass('ion-minus');      
      $(".toggle-content3").slideUp('fast');
    }
    else if(step == "step5") {
      this.step5 = true;   
      $(".slide4").find('i').addClass('ion-plus');
      $(".slide4").find('i').removeClass('ion-minus');      
      $(".toggle-content4").slideUp('fast');          
    }
    else {
      console.log("Something went wrong!");
    }
  }

  countAdditionalNotes(value) {
      let text_max = 1000;
      $('#count_message2').html(text_max + ' characters' + ' remaining');    
        var text_length = $('#issueadditionalnotes').val().length;
        var text_remaining = text_max - text_length;	  
        $('#count_message2').html(text_remaining + ' characters' + ' remaining');    
  }

  countIssueDescription(value) {
    let text_max = 1000;
    $('#count_message').html(text_max + ' characters' + ' remaining');    
      var text_length = $('#issuedescription').val().length;
      var text_remaining = text_max - text_length;	  
      $('#count_message').html(text_remaining + ' characters' + ' remaining');    
}
// Checking Disabled Categroy.
checkDisabledArray(catid) {
  let newArray: any[] = [];
  newArray = this.disabledArray;
  let value = 1;
  for( let d of newArray) {
    if(d.cat_id == catid) {
      value = 2;
      break;
    }
  }
  return value;
}
  ngOnInit() {
    //$("#slide1toggel").css("background-color", "#000000");
    // Initialize the Datetime Picker
    $(document).on('click','#gostep5', function(event){
        $('#mydatetimepicker').datetimepicker({  minDate:new Date()});
    });
    $(document).on('click','#accesspropertywithme', function(event){
        $('#mydatetimepicker').datetimepicker({  minDate:new Date()});
        let datevalue = $('#datevalueselected').val();
        this.issueForm.controls['visitdatetime'].setValue(datevalue);
        //console.log("Date Value " + datevalue);
    });  

    this.issueimagefirst_config = {
      url: 'https://repair.smarttenant.co.uk/uploadimages/fileupload.php',
      params: null,                         // Url parameters to be added to the server url (Default: null).
      autoReset: null,                      // Time for resetting upload area after upload (Default: null).
      errorReset: null,                     // Time for resetting upload area after an error (Default: null).
      cancelReset: null,                    // Time for resetting upload area after canceling (Default: null).
      //Dropzone options
      method: 'post',                       // HTTP method to use communicating with the server (Default: 'post').
      headers: {"additional":"header"},     // Object of additional headers to send to the server (Default: null).
      paramName: 'file',                    // Name of the file parameter that gets transferred (Default: 'file').
      maxFilesize: 6,                       // Maximum file size for the upload files in megabytes (Default: null).
      acceptedFiles: 'image/*',             // Comma separated list of mime types or file extensions (Default: null).
      addRemoveLinks: true,
      clickable: true,
      resizeWidth: 600,
      dictDefaultMessage: "Upload Image",
      maxFiles: 1,
      thumbnailWidth: 200,
      thumbnailHeight: 200
    };

    this.issueimagesecond_config = {
      url: 'https://repair.smarttenant.co.uk/uploadimages/fileupload.php',
      params: null,                         // Url parameters to be added to the server url (Default: null).
      autoReset: null,                      // Time for resetting upload area after upload (Default: null).
      errorReset: null,                     // Time for resetting upload area after an error (Default: null).
      cancelReset: null,                    // Time for resetting upload area after canceling (Default: null).
      //Dropzone options
      method: 'post',                       // HTTP method to use communicating with the server (Default: 'post').
      headers: {"additional":"header"},     // Object of additional headers to send to the server (Default: null).
      paramName: 'file',                    // Name of the file parameter that gets transferred (Default: 'file').
      maxFilesize: 6,                       // Maximum file size for the upload files in megabytes (Default: null).
      acceptedFiles: 'image/*',             // Comma separated list of mime types or file extensions (Default: null).
      addRemoveLinks: true,
      clickable: true,
      resizeWidth: 600,
      dictDefaultMessage: "Upload Image",
      maxFiles: 1,
      thumbnailWidth: 200,
      thumbnailHeight: 200
    };

    this.issueimagethird_config = {
      url: 'https://repair.smarttenant.co.uk/uploadimages/fileupload.php',
      params: null,                         // Url parameters to be added to the server url (Default: null).
      autoReset: null,                      // Time for resetting upload area after upload (Default: null).
      errorReset: null,                     // Time for resetting upload area after an error (Default: null).
      cancelReset: null,                    // Time for resetting upload area after canceling (Default: null).
      //Dropzone options
      method: 'post',                       // HTTP method to use communicating with the server (Default: 'post').
      headers: {"additional":"header"},     // Object of additional headers to send to the server (Default: null).
      paramName: 'file',                    // Name of the file parameter that gets transferred (Default: 'file').
      maxFilesize: 6,                       // Maximum file size for the upload files in megabytes (Default: null).
      acceptedFiles: 'image/*',             // Comma separated list of mime types or file extensions (Default: null).
      addRemoveLinks: true,
      clickable: true,
      resizeWidth: 600,
      dictDefaultMessage: "Upload Image",
      maxFiles: 1,
      thumbnailWidth: 200,
      thumbnailHeight: 200
    };

    $(document).on('click','.accordion-toggle', function(event){
          event.preventDefault();
          // create accordion variables
          var accordion = $(this); 
          var rel = accordion.attr('rel'); //console.log(rel);
          var accordionContent = accordion.next('.accordion-content');    
          // toggle accordion link open class
          accordion.toggleClass("open");
          accordion.toggleClass('active').find('i').toggleClass('ion-plus ion-minus');
          // toggle accordion content
          accordionContent.slideToggle(350);  
    });

    // Get All Disabled Category for the current agent
    this.agent.getAgentDisabledCatList(localStorage.getItem('userid'))
    .subscribe( (data) => {
      this.disabledArray = data;
    });

    this.agent.getParentCategories()
    .subscribe(data => {
        if(data) {
          for( let entry of data ) {
            let value: any;
            value = this.checkDisabledArray(entry.cat_id);
            if(value == 1) {
              this.parentCatList.push(entry);
            }
          }          
        }
    });
    // Get AgentDetails
    let username = this.route.snapshot.paramMap.get('username');   
    localStorage.setItem('agent_url', username);
    this.agent.getAgentDetails(username)
    .subscribe(data => {
      this.issueForm.controls['agentname'].setValue(data.name);
      this.issueForm.controls['agentid'].setValue(data.id);
      this.issueForm.controls['agentphone'].setValue(data.phone);
      this.issueForm.controls['agentemail'].setValue(data.email);
      this.issueForm.controls['agentusername'].setValue(username);
      localStorage.setItem('userid', data.id);
      
      if(data == 0 || data.status == 2)
        this.router.navigate(['404']);
    });
    if(localStorage.getItem('customer_key')) {
      let email = localStorage.getItem('customer_key');
      this.getTenantDetails(email);
      this.issueForm.controls['customertype'].setValue('registered');
     
    }
    else {
      this.issueForm.controls['customertype'].setValue('guest');
      this.issueForm.controls['tenantid'].setValue(0);
    }
           
    
  }

  getTenantDetails(email) {
    this.agent.getTenantData(email)
    .subscribe(data => {  
      this.issueForm.controls['email'].setValue(email);
      this.issueForm.controls['fullname'].setValue(data.name);
      this.issueForm.controls['contactnumber'].setValue(data.phone);
      this.issueForm.controls['postcode'].setValue(data.postcode);
      this.issueForm.controls['address'].setValue(data.address);
      this.issueForm.controls['tenantid'].setValue(data.id);
      // get city if postcode is correct
      this.agent.getCity(this.issueForm.value.postcode)
      .subscribe(data => {
        if(data.status == 200) {
          this.issueForm.controls['city'].setValue(data.result.admin_district);
          let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
          this.issueForm.controls['county'].setValue(county);
          this.issueForm.controls['country'].setValue(data.result.country);
          this.isCity = true;
          this.isCounty = true;
          this.isCountry = true;
        }
      });                  
      if(data.alternate_number) {
        this.issueForm.controls['alternatenumber'].setValue(data.alternate_number);
        this.isAlternateNumber = true;
      }
      this.loggedUser = true;   
    });
  
  }

  loadCategories() {
    this.agent.getCategories().subscribe(
      data => {
        this.categories = data;
      }
    );
  }
  // Change the background color of categories on mouse hover and out.
  onMouseOut($event,id) {
    $('#'+id).css("background-color", "#f9f7f5");    
  }
  onMouseOver($event,id) {
    $('#'+id).css("background-color", this.bannercolor);
  }
  isActive(item) {
      return this.selected === item;
  }

  checkCondition() {
    let formData = this.issueForm.value;
    if(formData.confirmterm == false) {
      this.isconfirm = false;
      this.isFormValid = false;
      window.scrollTo(0,0);
    }
    else {
      this.isconfirm = true;
    }
  }
  submitIssue() {
    let datevalue = $('#datevalueselected').val();
    this.issueForm.controls['visitdatetime'].setValue(datevalue);    
    let formData = this.issueForm.value;
    //validate for input data
   // console.log(formData);
    if(formData.selectedcategory == "") {
      this.iscategory = false;
      this.isFormValid = false;
    }
    else {
      this.iscategory = true;
      this.isFormValid = true;
    }
    if(formData.postcode == "") {
      this.ispostcode = false;
      this.isFormValid = false;
    }
    else {
      this.ispostcode = true;
      this.isFormValid = true;
    }
    if(formData.email == "") {
      this.isemail = false;
      this.isFormValid = false;
    }
    else {
      this.isemail = true;
      this.isFormValid = true;
    }
    if(formData.fullname == "") {
      this.isfullname = false;
      this.isFormValid = false;
    }
    else {
      this.isfullname = true;
      this.isFormValid = true;
    }
    if(formData.address == "") {
      this.isaddress = false;
      this.isFormValid = false;
    }
    else {
      this.isaddress = true;
      this.isFormValid = true;
    }
    if(formData.contactnumber == "") {
      this.isphone = false;
      this.isFormValid = false;
    }
    else {
      this.isphone = true;
      this.isFormValid = true;
    }
    
    if(this.issueForm.invalid) {
      this.isFormValid = false;
      window.scrollTo(0,0);
    }
    else {
      swal({
        title: 'Are you sure?',
        text: "You want to submit the issue!",
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
          this.agent.saveIssue(this.issueForm.value)
          .subscribe(result => {
            this.isLoading = false;
            if (result['status'] == "success") {
              this.issueid = result['message'];
                this.step1 = true;
                this.step2 = false;
                this.step3 = false;
                this.step4 = false;
                this.step5 = false;
                this.isSubcat = false;
                this.nosubcat = false;
                this.clickedCat = false;
                this.isSubcat2 = false;
                this.previousCatPageLevel = "";
                this.issueForm.controls['issuedescription'].setValue('');
                this.issueForm.controls['confirmterm'].setValue(false);
                $(".slide1").find('i').removeClass('ion-plus');
                $(".slide1").find('i').addClass('ion-minus');
                $(".toggle-content1").css("display", "block");
                this.isLoading = true;     
              swal({
                title: 'Submitted!',
                text: 'Your generated issue id is #' + result['message'],
                type: 'success',
                confirmButtonColor: localStorage.getItem('bannercolor')
              }).then(() => { setTimeout( function () {
                  window.scrollTo(0,0);                
                },1000)});           
            }
            else if(result['status'] == "mail error") {
              this.issueid = result['message'];
                this.step1 = true;
                this.step2 = false;
                this.step3 = false;
                this.step4 = false;
                this.step5 = false;
                this.isSubcat = false;
                this.nosubcat = false;
                this.clickedCat = false;
                this.isSubcat2 = false;
                this.previousCatPageLevel = "";
                this.issueForm.controls['issuedescription'].setValue('');
                this.issueForm.controls['confirmterm'].setValue(false);
                $(".slide1").find('i').removeClass('ion-plus');
                $(".slide1").find('i').addClass('ion-minus');
                $(".toggle-content1").css("display", "block");
                this.isLoading = true;               
              swal({
                title: 'Submitted!',
                text: 'Your generated issue id is #' + result['message'] + 'mail not sent!',
                type: 'success',
                confirmButtonColor: localStorage.getItem('bannercolor')
              }).then(() => { setTimeout( function () { window.scrollTo(0,0); },1000)});
            }
            else {
              swal({
                title: 'Error!',
                text: 'Try again later.',
                type: 'error',
                confirmButtonColor: localStorage.getItem('bannercolor')
              }).then(() => { setTimeout( function () { window.scrollTo(0,0); },1000)});              
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
}
