import { GlobalValues } from './../../_helper/global';
import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { NgStyle, DatePipe } from '@angular/common';

declare var swal: any;


@Component({
  selector: 'app-tenant-update-issue',
  templateUrl: './tenant-update-issue.component.html',
  styleUrls: ['./tenant-update-issue.component.css']
})
export class TenantUpdateIssueComponent implements OnInit {
  updatedValue: any[];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];  
  issueEditForm;
  result: any;
  issueDetails: any;
  successMsg: string;
  issue_created_date: any;
  want_to_present_date: any;
  visitdatetime: any;
  vulnerablevalue = "No";
  lastupdated_date: any;  
  updatedissue: boolean = false;
  isValueEmpty: boolean = false;
  invalidPostcode: boolean = false;
  issueid;
  getstatus;
  imagename = "";
  isCommentExist: boolean = false;
  previouscomment;
  loggedUserDetails : any[];
  tenantName;
  agentUsername;
  issueImageExist: boolean = false;
  issueImage1 = "noissueimage.png";
  issueImage2 = "noissueimage.png";
  issueImage3 = "noissueimage.png";
  isLoading: boolean = true;
  showVisitDateTime: boolean = false;
  bannercolor: string;
  siteurl: string;
  status = [
    { value: 'Open', name: 'Open' },
    { value: 'In Progress', name: 'In Progress' },
    { value: 'Closed', name: 'Closed' },
  ];

  constructor(private http: Http, private activateroute: ActivatedRoute, private agent: AgentService,formbuilder: FormBuilder) {
    this.siteurl = GlobalValues.SITEURL;
    this.issueEditForm = formbuilder.group({
      issuetype: [''],
      issueid: [''],
      postcode: ['', [Validators.required, Validators.pattern("^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$")]],
      city:[''],
      county:[''],
      country:[''],
      address: ['', Validators.required],
      customername: [''],
      customeremail: [''],
      phone: ['', [Validators.required, Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      alternatephone: ['', [Validators.pattern("^[0-9{2}[ ]?[0-9]{10,11}")]],
      customernotes: [''],
      issuestatus: [''],
      manufacturer: [''],
      modelnumber: [''],
      serialnumber: [''],
      accessproperty: [''],
      issuecreated: [''],
      agentname: [''],      
      agentid: [''],
      agentphone: [''],
      agentemail: [''], 
      customerid: [''],
      customertype: [''],
      addcomments: ['', Validators.required],  
      logged_in_usertype: [''],
      logged_in_userid: [''],
      logged_in_username: [''],
      additionalnotes: ['']
    });    
   }
  onMouseOut($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
   // console.log("mouseout");
   //  console.log($value);

  }
  onMouseOver($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
   //  console.log("mouseover");
   //   console.log($value);
  }
  ngOnInit() {
    this.bannercolor = localStorage.getItem('bannercolor');
    this.agentUsername = localStorage.getItem('agent_url');
    this.tenantName = localStorage.getItem('customer_name');
    this.result = this.activateroute.params.subscribe(params=> {
      this.issueid = params['id'];
      this.issueEditForm.controls['issueid'].setValue(params['id']);
      this.getIssue(params['id']);
    });
    this.galleryOptions = [
      {
        width: '400px',
        height: '300px',
        thumbnailsColumns: 3
      }
    ];    

  }
  getIssue(id) {
    this.agent.getIssueDetails(id)
    .subscribe(data => {
        this.issueEditForm.controls['issuetype'].setValue(data.cat_name);
        this.issueEditForm.controls['customername'].setValue(data.tenant_name);
        this.issueEditForm.controls['customeremail'].setValue(data.tenant_email);
        this.issueEditForm.controls['phone'].setValue(data.tenant_phone);
        this.issueEditForm.controls['alternatephone'].setValue(data.tenant_alternatephone);
        this.issueEditForm.controls['address'].setValue(data.tenant_address);
        this.issueEditForm.controls['postcode'].setValue(data.tenant_postcode);
        this.issueEditForm.controls['agentid'].setValue(data.agent_id);
        this.issueEditForm.controls['agentname'].setValue(data.agent_name);
        this.issueEditForm.controls['agentemail'].setValue(data.agent_email);
        this.issueEditForm.controls['agentphone'].setValue(data.agent_phone);
        this.issueEditForm.controls['issuestatus'].setValue(data.status);
        this.issueEditForm.controls['customernotes'].setValue(data.issue_description);        
        this.issue_created_date = data.issue_created_date;
       // this.issue_created_date = new Date(this.issue_created_date);
       // let mydate = "2018-04-04 13:51:18".replace(/-/g, "/");
        //let testdate = new Date(this.issue_created_date);
       // console.log("test date " + testdate);
       // console.log(mydate);
        //console.log(data.issue_created_date);
       // console.log(this.issue_created_date);
        this.visitdatetime = data.want_to_be_present;
        //this.issueEditForm.controls['issuecreated'].setValue(data.issue_created_date);
        this.issueEditForm.controls['modelnumber'].setValue(data.modelnumber);
        this.issueEditForm.controls['manufacturer'].setValue(data.manufacturer);
        this.issueEditForm.controls['serialnumber'].setValue(data.serialnumber);
        this.issueEditForm.controls['customerid'].setValue(data.tenant_id);
        this.issueEditForm.controls['customertype'].setValue(data.tenant_type);
        this.issueEditForm.controls['additionalnotes'].setValue(data.additional_notes);
        this.issueEditForm.controls['city'].setValue(data.tenant_city);
        this.issueEditForm.controls['county'].setValue(data.tenant_county);
        this.issueEditForm.controls['country'].setValue(data.tenant_country);
        this.getstatus = data.status;
        
        if(data.accessproperty == true ) {
          this.showVisitDateTime = true;
        }

        if(data.vulnerableproperty == true) {
          this.vulnerablevalue = "Yes";
        }

        if(data.issue_image1 != "" || data.issue_image2 != "" || data.issue_image3 != "") {
          this.issueImageExist = true;
        }
        this.issueImage1 = (data.issue_image1 != "") ? data.issue_image1 : "noissueimage.png";
        this.issueImage2 = (data.issue_image2 != "") ? data.issue_image2 : "noissueimage.png";
        this.issueImage3 = (data.issue_image3 != "") ? data.issue_image3 : "noissueimage.png";
        this.galleryImages = [
          {
            small: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage1,
            medium: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage1,
            big: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage1,
          },
          {
            small: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage2,
            medium: this.siteurl + '/uploadimages/uploadimages/' +  this.issueImage2,
            big: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage2
          },
          {
            small: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage3,
            medium: this.siteurl + '/uploadimages/uploadimages/' +  this.issueImage3,
            big: this.siteurl + '/uploadimages/uploadimages/' + this.issueImage3
          }    
        ];
        

        // Get Tenant Details 
        this.agent.getTenantData(localStorage.getItem('customer_key'))
        .subscribe(result => {
          this.loggedUserDetails = result;
          this.issueEditForm.controls['logged_in_userid'].setValue(result.id);
          this.issueEditForm.controls['logged_in_username'].setValue(result.name);
          this.issueEditForm.controls['logged_in_usertype'].setValue('tenant');
        });

        this.agent.getIssueUpdateDetails(id)
        .subscribe(result => {
          if(result) {
            this.isCommentExist = true;
            this.previouscomment = result[0].user_comments;
          }
        });
    });
  }
  getCity() {
  this.agent.getCity(this.issueEditForm.value.postcode)
  .subscribe(data => {
    //console.log(data);
    if(data.status == 200) {
      this.invalidPostcode = false;
      this.issueEditForm.controls['city'].setValue(data.result.admin_district);
      let county = (data.result.admin_county == null ) ? data.result.european_electoral_region : data.result.admin_county;
      this.issueEditForm.controls['county'].setValue(county);
      this.issueEditForm.controls['country'].setValue(data.result.country); 
    }
    else {
      this.invalidPostcode = true;
      console.log("Postcode Invalid");
    }
  });
  //"http://maps.googleapis.com/maps/api/geocode/json?address="+this.issueForm.value.postcode+"&sensor=true";    
}
  updateIssue() {
    //console.log(this.issueEditForm.value.issueid);
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
        this.agent.updateIssue(this.issueEditForm.value)
        .subscribe(result => {
          this.isLoading = false;
          if (result['status'] == "success") {
           // this.getIssue(this.issueEditForm.value.issueid);
           // this.isLoading = true;
            swal({
              title: 'Updated!',
              text: 'Details has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('bannercolor')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});        
          }
          else if(result['status'] == "mail error") {
           // this.getIssue(this.issueEditForm.value.issueid);
           // this.isLoading = true;
            swal({
              title: 'Updated!',
              text: 'Details has been updated. Mail not sent!',
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
             }).then(() => { setTimeout( function () { window.scrollTo(0,0); },1000)})        
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
