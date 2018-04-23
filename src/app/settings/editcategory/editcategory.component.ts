import { GlobalValues } from './../../_helper/global';
import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { DropzoneModule, DropzoneConfig, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import { Router, ActivatedRoute } from '@angular/router';


declare var swal: any;
declare var $;

@Component({
  selector: 'app-editcategory',
  templateUrl: './editcategory.component.html',
  styleUrls: ['./editcategory.component.css']
})
export class EditcategoryComponent implements OnInit {
  category_image: DropzoneConfigInterface;
  categoryimagevalue = "";
  editcategoryForm;
  parentcat: any;
  bannercolor: string;
  categoryList: any[];
  isLoading: boolean = true;
  catid: any;
  imagename = "";
  catstatus: any;
  isParent: boolean = false;
  siteurl: string;
  constructor(private agent: AgentService, formbuilder: FormBuilder, private activateroute: ActivatedRoute) {
    this.siteurl = GlobalValues.SITEURL;
    
    this.editcategoryForm = formbuilder.group({
      categoryname: ['', Validators.required],
      parentcategory: [''],
      description: [''],
      categoryimage: [''],
      notice: [''],
      status: [''],
      position: [''],
      catid: ['']
    });
  }

  ngOnInit() { 
    this.activateroute.params.subscribe(params=> {
      this.catid = params['id'];
      this.editcategoryForm.controls['catid'].setValue(this.catid); 
      this.agent.getEditCategories(this.catid)
      .subscribe( result => {
        if(result) {
          this.categoryList = result;
        }
      });      
      this.agent.getCategoryById(this.catid)
      .subscribe( result => {
       // console.log(result[0]);
        if(result[0].cat_image) {
          this.imagename = result[0].cat_image;
          this.categoryimagevalue = result[0].cat_image;
          this.parentcat = result[0].parent;
          if(result[0].parent == 0) {
            this.isParent = true;
          }
        }
        this.editcategoryForm.controls['categoryname'].setValue(result[0].cat_name);
        this.editcategoryForm.controls['categoryimage'].setValue(result[0].cat_image);
        this.editcategoryForm.controls['description'].setValue(result[0].cat_description);
        this.editcategoryForm.controls['notice'].setValue(result[0].notice);
        this.editcategoryForm.controls['status'].setValue(result[0].status); 
        this.editcategoryForm.controls['position'].setValue(result[0].position);
        this.editcategoryForm.controls['parentcategory'].setValue(result[0].parent);
        this.catstatus = result[0].status;

      });
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

  // Image Functions
  onRemove($event) {
    this.agent.removeimage(this.categoryimagevalue)
    .subscribe(response=>{ 
      this.editcategoryForm.controls['categoryimage'].setValue("");
      this.categoryimagevalue = "";
    });
  }
  onUploadSuccess($event) {
    //$event returns [File, Object, ProgressEvent];
     //console.log("onUploadSuccess($event)", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.categoryimagevalue = data.generatedName;
     this.editcategoryForm.controls['categoryimage'].setValue(this.categoryimagevalue);
  }

  onUploadError($event) {
   // console.log("onUploadError($event)", $event);
      this.editcategoryForm.controls['categoryimage'].setValue("");
      this.categoryimagevalue = "";
      swal({
        title: 'Error!',
        text: $event[1],
        type: 'error'
        }).then(() => { setTimeout( function () { location.reload(); },1000)})       
  }

  onUploadCanceled($event) {
    //console.log("onUploadCanceled($event)", $event);
      this.editcategoryForm.controls['categoryimage'].setValue("");
      this.categoryimagevalue = "";    
  }

  onDrop($event) {
   // console.log("Just dropped", $event);
     let data =JSON.parse($event[1].toString()); // to parse the json string.
     this.categoryimagevalue = data.generatedName;
     this.editcategoryForm.controls['categoryimage'].setValue(this.categoryimagevalue);    
  }
  // Image Functions End

  updateCategory() {
    //console.log(this.editcategoryForm.value);
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
                
        this.agent.updateCategory(this.editcategoryForm.value)
        .subscribe(result => {
          if (result==true) {
            this.isLoading = false;
            swal({
              title: 'Updated!',
              text: 'Category has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});            
          }
          else if(result['status'] == "mail error") {
            swal({
              title: 'Updated!',
              text: 'Category has been updated. Mail not sent!',
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

}
