import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { AgentService } from './../../services/agent.service';
import { DropzoneModule, DropzoneConfig, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';

declare var swal: any;
declare var $;

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {
  category_image: DropzoneConfigInterface;
  categoryimagevalue = "";
  categoryForm;
  bannercolor: string;
  categoryList: any[];
  isLoading: boolean = true;

  constructor(formbuilder: FormBuilder, private agent:AgentService) { 
    this.categoryForm = formbuilder.group({
      categoryname: ['', Validators.required],
      parentcategory: [''],
      description: [''],
      categoryimage: ['', Validators.required],
      notice: ['']
    });    
  }

  ngOnInit() {

    this.agent.getCategories()
    .subscribe( result => {
      if(result) {
        this.categoryList = result;
      }
    }); 
    this.bannercolor = localStorage.getItem('admin_banner_color');
    this.category_image = {
      url: 'https://repair.smarttenant.co.uk/uploadimages/categoryimageupload.php',
      //Library options

      params: null,                         // Url parameters to be added to the server url (Default: null).
      autoReset: null,                      // Time for resetting upload area after upload (Default: null).
      errorReset: null,                     // Time for resetting upload area after an error (Default: null).
      cancelReset: null,                    // Time for resetting upload area after canceling (Default: null).

      //Dropzone options

      method: 'post',                       // HTTP method to use communicating with the server (Default: 'post').
      headers: {"additional":"header"},     // Object of additional headers to send to the server (Default: null).
      paramName: 'file',                    // Name of the file parameter that gets transferred (Default: 'file').
      maxFilesize: 2,                       // Maximum file size for the upload files in megabytes (Default: null).
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
      //this.categoryForm.controls['categoryimage'].setValue("");
      //this.categoryimagevalue = "";
    this.agent.removecategoryimage(this.categoryimagevalue)
    .subscribe(response=>{ 
      this.categoryForm.controls['categoryimage'].setValue("");
      this.categoryimagevalue = "";
    });
  }
  onUploadSuccess($event) {
    //$event returns [File, Object, ProgressEvent];
     console.log("onUploadSuccess($event)", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.categoryimagevalue = data.generatedName;
     this.categoryForm.controls['categoryimage'].setValue(this.categoryimagevalue);
  }

  onUploadError($event) {
    console.log("onUploadError($event)", $event);
      this.categoryForm.controls['categoryimage'].setValue("");
      this.categoryimagevalue = "";
      swal({
        title: 'Error!',
        text: $event[1],
        type: 'error'
        }).then(() => { setTimeout( function () { location.reload(); },1000)})       
  }

  onUploadCanceled($event) {
    console.log("onUploadCanceled($event)", $event);
      this.categoryForm.controls['categoryimage'].setValue("");
      this.categoryimagevalue = "";    
  }

  onDrop($event) {
    console.log("Just dropped", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.categoryimagevalue = data.generatedName;
     this.categoryForm.controls['categoryimage'].setValue(this.categoryimagevalue);    
  }

  addCategory() {
    console.log(this.categoryForm.value);
    swal({
      title: 'Are you sure?',
      text: "You want to update the category details!",
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
                
        this.agent.saveCategory(this.categoryForm.value)
        .subscribe(result => {
          if (result==true) {
            this.isLoading = false;
            swal({
              title: 'Added!',
              text: 'Category has been added.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});            
          }
          else if(result['status'] == "mail error") {
            swal({
              title: 'Added!',
              text: 'Category has been added. Mail not sent!',
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

} // Main class end

