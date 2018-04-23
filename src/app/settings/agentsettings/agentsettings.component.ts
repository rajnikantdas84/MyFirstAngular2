import { GlobalValues } from './../../_helper/global';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { AgentService } from './../../services/agent.service';
import { DropzoneModule, DropzoneConfig, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';


declare var swal: any;

@Component({
  selector: 'app-agentsettings',
  templateUrl: './agentsettings.component.html',
  styleUrls: ['./agentsettings.component.css']
})
export class AgentsettingsComponent implements OnInit {

  agentSettingForm;
  logimageurl = "";
  imagename;
  agentList: any[];
  languageList: any[];
  logoimagevalue = "";
  selectagentError: boolean = false;
  successMsg = "Settings Updated Successfully!";
  agentlogo_config: DropzoneConfigInterface;
  isLoading: boolean = true;
  bannercolor: string;
  siteurl: string;

  constructor(formbuilder: FormBuilder, private agent:AgentService) {
    this.siteurl = GlobalValues.SITEURL;
    this.agentSettingForm = formbuilder.group({
      selectedagent: [''],
      preferredlanguage1: [''],
      preferredlanguage2: [''],
      preferredlanguage3: [''],
      emailnotification: [''],
      logoimage: [''],
      logoalignment: [''],
      emailcc: [''],
      bannercolor: ['']
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

    this.agent.getPageSettings('admin')
    .subscribe(result => {
        this.agentSettingForm.controls['preferredlanguage1'].setValue(result.preferred_language_1);
        this.agentSettingForm.controls['preferredlanguage2'].setValue(result.preferred_language_2);
        this.agentSettingForm.controls['preferredlanguage3'].setValue(result.preferred_language_3);
        this.agentSettingForm.controls['emailnotification'].setValue(result.email_notification);
        this.agentSettingForm.controls['logoimage'].setValue(result.logo_image);
        this.agentSettingForm.controls['bannercolor'].setValue(result.banner_color);
        $("#color-circle").css("background-color", result.banner_color);
        this.bannercolor = result.banner_color;
        this.imagename = result.logo_image;
    });

    this.agent.getAgentList()
    .subscribe(response=>{
      this.agentList = response;
    });
    this.agentlogo_config = {
        url: 'https://repair.smarttenant.co.uk/uploadimages/logoupload.php',
      //Library options

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
      dictDefaultMessage: "Upload Image",
      maxFiles: 1,
      thumbnailWidth: 300,
      thumbnailHeight: 100,
      resizeWidth: 300,
      resizeHeight: 100
    };


  }

  onRemove($event) {
    this.agent.removeimage(this.logoimagevalue)
    .subscribe(response=>{ 
      this.agentSettingForm.controls['logoimage'].setValue("");
      this.logoimagevalue = "";
    });
  }
  onUploadSuccess($event) {
    //$event returns [File, Object, ProgressEvent];
     console.log("onUploadSuccess($event)", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.logoimagevalue = data.generatedName;
     this.agentSettingForm.controls['logoimage'].setValue(this.logoimagevalue);
  }

  onUploadError($event) {
    console.log("onUploadError($event)", $event);
      this.agentSettingForm.controls['logoimage'].setValue("");
      this.logoimagevalue = "";
      swal({
        title: 'Error!',
        text: $event[1],
        type: 'error',
        confirmButtonColor: localStorage.getItem('admin_banner_color')
        }).then(() => { setTimeout( function () { location.reload(); },500)})
  }

  onUploadCanceled($event) {
    console.log("onUploadCanceled($event)", $event);
      this.agentSettingForm.controls['logoimage'].setValue("");
      this.logoimagevalue = "";    
  }

  onDrop($event) {
    console.log("Just dropped", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.logoimagevalue = data.generatedName;
     this.agentSettingForm.controls['logoimage'].setValue(this.logoimagevalue);    
  }

  revertSetting() {
    swal({
      title: 'Are you sure?',
      text: "You want to revert the settings!",
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
      this.agent.getPageSettings('admin')
      .subscribe(result => {
          this.agentSettingForm.controls['preferredlanguage1'].setValue(result.preferred_language_1);
          this.agentSettingForm.controls['preferredlanguage2'].setValue(result.preferred_language_2);
          this.agentSettingForm.controls['preferredlanguage3'].setValue(result.preferred_language_3);
          this.agentSettingForm.controls['emailnotification'].setValue(result.email_notification);
          this.agentSettingForm.controls['logoimage'].setValue(result.logo_image);
          this.agentSettingForm.controls['bannercolor'].setValue(result.banner_color);
          $("#color-circle").css("background-color", result.banner_color);
          this.bannercolor = result.banner_color;         
          this.imagename = result.logo_image;
          console.log(this.agentSettingForm.value);
          // Update the settings to default
          this.agent.updateSettings(this.agentSettingForm.value)
          .subscribe(result => {
          this.isLoading = false;
          if (result == true) {
            swal({
              title: 'Reverted!',
              text: 'Settings has been reverted to default.',
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

      });      
      //setTimeout( function () { location.reload(); },500)
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
    });
    return false;
  }
  checkAgent() {
    if(this.agentSettingForm.value['selectedagent']!== "") {
      this.selectagentError = false;
      //console.log(this.agentSettingForm.value['selectedagent']);
      this.agent.getPageSettings(this.agentSettingForm.value['selectedagent'])
      .subscribe(result => {
        if(result) {
          this.agentSettingForm.controls['preferredlanguage1'].setValue(result.preferred_language_1);
          this.agentSettingForm.controls['preferredlanguage2'].setValue(result.preferred_language_2);
          this.agentSettingForm.controls['preferredlanguage3'].setValue(result.preferred_language_3);
          this.agentSettingForm.controls['emailnotification'].setValue(result.email_notification);
          this.agentSettingForm.controls['logoimage'].setValue(result.logo_image);
          this.agentSettingForm.controls['bannercolor'].setValue(result.banner_color);
          this.imagename = result.logo_image;
          $("#color-circle").css("background-color", result.banner_color);
        }         
      }); 
    }
    else {
      this.selectagentError = true;
      window.scrollTo(0,0);
    }
  }

  updateSetting() {  
    console.log(this.agentSettingForm.value);
    if(this.agentSettingForm.value['selectedagent'] == "") {
      this.selectagentError = true;
      window.scrollTo(0,0);
    }
    else {
      console.log(this.agentSettingForm.value);
      swal({
        title: 'Are you sure?',
        text: "You want to update the settings!",
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
          this.agent.updateSettings(this.agentSettingForm.value)
          .subscribe(result => {
            this.isLoading = false;
            if (result == true) {
              swal({
                title: 'Updated!',
                text: 'Settings has been updated.',
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
  }    

}
