import { DatePipe } from '@angular/common';
import { GlobalValues } from './../_helper/global';
import { Component, OnInit } from '@angular/core';
import { AgentService } from './../services/agent.service';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { CustomValidators } from './../_helper/custom.validator';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as base64Img from 'base64-img';
import { Observable } from 'rxjs';

import base64url from "base64-url";

//var base64Img = require('base64-img');


declare var swal: any;
declare var $;
declare var roundabout;

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  issue_created_date: any;
  want_to_present_date: any;
  visitdatetime: any;
  lastupdated_date: any;
  isChangePassword: boolean = false;
  updatedValue: any[];
  issueEditForm;
  result: any;
  issueDetails: any[];
  successMsg: string;
  updatedissue: boolean = false;
  isValueEmpty: boolean = false;
  issueid;
  getstatus;
  vulnerablevalue = "No";
  isCommentExist: boolean = false;
  previouscomment;
  loggedUserDetails : any[];
  issueImageExist: boolean = false;
  issueImage1 = "noissueimage.png";
  issueImage2 = "noissueimage.png";
  issueImage3 = "noissueimage.png";
  isLoading: boolean = true;
  showVisitDateTime: boolean = false;
  bannercolor: string;
  baseimage: string;
  siteurl: string;
  base64textString:String= "";
  base64Image1: any;
  base64Image2: any;
  base64Image3: any;

  status = [
    { value: 'Open', name: 'Open' },
    { value: 'In Progress', name: 'In Progress' },
    { value: 'Closed', name: 'Closed' },
  ];  

  constructor(private http: Http, private activateroute: ActivatedRoute, private agent: AgentService,formbuilder: FormBuilder, private customvalidators: CustomValidators, private datepipe: DatePipe) {

    this.siteurl = GlobalValues.SITEURL;
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;    
    this.issueEditForm = formbuilder.group({
      issuetype: [''],
      issueid: [''],
      postcode: [''],
      city: [''],
      county:[''],
      country:[''],
      address: [''],
      customername: [''],
      customeremail: [''],
      phone: [''],
      alternatephone: [''],
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
      additionalnotes: [''],
      imageone: ['']
      
    });

   }
      
  ngOnInit() {
    
    let banner_color = localStorage.getItem('admin_banner_color');
    $("#submit").css("background", banner_color);
    $("#submit").css("border-color", banner_color);    
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
    this.bannercolor = localStorage.getItem('admin_banner_color');
    

  }  
 getBase64ImageFromURL(url: string) {
    return Observable.create((observer: any) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  } 
  getIssue(id) {
    this.agent.getIssueDetails(id)
    .subscribe(data => {
        this.issueDetails = data;
        //console.log(this.issueDetails);
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
       // this.issueEditForm.controls['issuecreated'].setValue(data.issue_created_date);
        this.issueEditForm.controls['modelnumber'].setValue(data.modelnumber);
        this.issueEditForm.controls['manufacturer'].setValue(data.manufacturer);
        this.issueEditForm.controls['serialnumber'].setValue(data.serialnumber);
        this.issueEditForm.controls['customerid'].setValue(data.tenant_id);
        this.issueEditForm.controls['customertype'].setValue(data.tenant_type);
        this.issueEditForm.controls['additionalnotes'].setValue(data.additional_notes);
        this.issueEditForm.controls['city'].setValue(data.tenant_city);
        this.issueEditForm.controls['county'].setValue(data.tenant_county);        
        this.issueEditForm.controls['country'].setValue(data.tenant_country);
        this.issueEditForm.controls['imageone'].setValue(data.issue_image1);
        this.visitdatetime = data.want_to_be_present;

        
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        if(this.issueDetails['issue_image1'] !="") {
          let imageURL = "";
          imageURL = this.siteurl + '/uploadimages/uploadimages/' + this.issueDetails['issue_image1'];
          this.getBase64ImageFromURL(imageURL).subscribe(base64data => {
            this.base64Image1 = 'data:image/jpg;image/png;base64,' + base64data;
            //console.log(this.base64Image1);
          });          
        }
        else {
          let imageURL = "";
          imageURL = this.siteurl + '/uploadimages/uploadimages/noissueimage.png';
          this.getBase64ImageFromURL(imageURL).subscribe(base64data => {
            this.base64Image1 = 'data:image/jpg;image/png;base64,' + base64data;
            //console.log(this.base64Image1);
          });          
        }
        if(this.issueDetails['issue_image2'] !="") {
            let imageURL2 = "";
            imageURL2 = this.siteurl + '/uploadimages/uploadimages/' + this.issueDetails['issue_image2'];
          this.getBase64ImageFromURL(imageURL2).subscribe(base64data => {
            this.base64Image2 = 'data:image/jpg;image/png;base64,' + base64data;
            //console.log(this.base64Image2);
          });             
        }
        else {
          let imageURL2 = "";
          imageURL2 = this.siteurl + '/uploadimages/uploadimages/noissueimage.png';
          this.getBase64ImageFromURL(imageURL2).subscribe(base64data => {
            this.base64Image2 = 'data:image/jpg;image/png;base64,' + base64data;
            //console.log(this.base64Image2);
          });          
        }        
        if(this.issueDetails['issue_image3'] !="") {
            let imageURL3 = "";
            imageURL3 = this.siteurl + '/uploadimages/uploadimages/' + this.issueDetails['issue_image3'];
          this.getBase64ImageFromURL(imageURL3).subscribe(base64data => {
            this.base64Image3 = 'data:image/jpg;image/png;base64,' + base64data;
            //console.log(this.base64Image3);
          });             
        }
        else {
          let imageURL3 = "";
          imageURL3 = this.siteurl + '/uploadimages/uploadimages/noissueimage.png';
          this.getBase64ImageFromURL(imageURL3).subscribe(base64data => {
            this.base64Image3 = 'data:image/jpg;image/png;base64,' + base64data;
            //console.log(this.base64Image);
          });          
        }       

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
        this.getstatus = data.status;
        if(localStorage.getItem('auth_key') == "admin") {
          this.issueEditForm.controls['logged_in_usertype'].setValue("admin");
        }
        else {
          this.issueEditForm.controls['logged_in_usertype'].setValue("agent");
        }
        this.agent.getAgentDetails(localStorage.getItem('auth_key'))
        .subscribe(result => {
          this.loggedUserDetails = result;
          this.issueEditForm.controls['logged_in_userid'].setValue(result.id);
          this.issueEditForm.controls['logged_in_username'].setValue(result.name);
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
  // Convert text into title case
  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }
  // Generate PDF
   openPDF() {
     //console.log(this.issueDetails);
      let issueImg = "";
      let issueImg1 = "";
      let issueImg2 = "";
      let issueImg3 = "";
      let visit_date = "";
      let issueraiseddate = this.datepipe.transform(this.issueDetails['issue_created_date'], 'dd-MMM-yy hh:mm:ss');
      if(this.base64Image1) {
        issueImg1 = this.base64Image1;
      }
      if(this.base64Image2) {
        issueImg2 = this.base64Image2;
      }
      if(this.base64Image3) {
        issueImg3 = this.base64Image3;
      }           
      let vulnerable = "No";
      if(this.issueDetails['vulnerableproperty'] == 1) {
        vulnerable = "Yes";
      }
      if(this.showVisitDateTime == true) {
        //visit_date = this.issueDetails['want_to_be_present'];
         visit_date = this.datepipe.transform(this.issueDetails['want_to_be_present'], 'dd-MMM-yy hh:mm:ss'); console.log(visit_date);
      }
      if(this.issueDetails['issue_image1'] !="" || this.issueDetails['issue_image2'] !="" || this.issueDetails['issue_image3'] !="") {
        issueImg = "Image exists";
      }
      else {
        issueImg = "";
      }
     // console.log("Issue IMG " + issueImg);
     //let test = Date.parse(this.issueDetails['want_to_be_present']);
      var withImg = {
      content: [
          {text: 'Issue ID: # ' + this.issueDetails['id'], fontSize: 20, bold: true, margin: [0, 10, 0, 8]},
          {text: 'Issue Type: ' + this.issueDetails['cat_name'], margin: [0, 10, 0, 0], bold: true},
          {text: 'Issue Status: ' + this.issueDetails['status'], margin: [0, 10, 0, 0], bold: true},
          {text: 'Issue Details', bold: true, margin: [0, 10, 0, 8]},
          {canvas: [{ type: 'line', x1: 0, y1: 1, x2: 595-2*40, y2: 1, lineWidth: 1 }]},
          {
            style: 'tableExample',
            table: {
              body: [
                [
                  {text: 'Address: '},
                  {text: this.titleCase(this.issueDetails['tenant_address']) + '\n '+ this.issueDetails['tenant_city'] +'\n ' + this.issueDetails['tenant_county'] + '\n' + this.issueDetails['tenant_postcode'] + '\n', bold: true},
                ],
                [
                  {text: 'Customer Name: '},
                  {text: this.titleCase(this.issueDetails['tenant_name']), bold: true},
                ], 
                [
                  {text: 'Customer Email: '},
                  {text: this.issueDetails['tenant_email'], bold: true},
                ], 
                [
                  {text: 'Customer Phone: '},
                  {text: this.issueDetails['tenant_phone'], bold: true},
                ],
                [
                  {text: 'Customer Alternate Phone: '},
                  {text: this.issueDetails['tenant_alternatephone'], bold: true},
                ],
                [
                  {text: 'Customer Type: '},
                  {text: this.titleCase(this.issueDetails['tenant_type']), bold: true},
                ],                
               /* [
                  {text: 'Vulnerable Occupiers: '},
                  {text: vulnerable, bold: true},
                ],*/
                [
                  {text: 'Issue Raised: '},
                  {text: issueraiseddate, bold: true},
                ],
                [
                  {text: 'Issue Description: '},
                  {text: this.titleCase(this.issueDetails['issue_description']), bold: true},
                ], 
                [
                  {text: 'Additional Notes: '},
                  {text: this.titleCase(this.issueDetails['additional_notes']), bold: true},
                ],
                [
                  {text: 'Manufacturer: '},
                  {text: this.titleCase(this.issueDetails['manufacturer']), bold: true},
                ],
                [
                  {text: 'Model Number: '},
                  {text: this.issueDetails['modelnumber'], bold: true},
                ],
                [
                  {text: 'Serial Number: '},
                  {text: this.issueDetails['serialnumber'], bold: true},
                ],
                [
                  {text: 'Time for Visit: '},
                  {text: visit_date, bold: true},
                ],                                                            
                [
                  {text: 'Agent Name: '},
                  {text: this.titleCase(this.issueDetails['agent_name']), bold: true},
                ],
                [
                  {text: 'Agent Email: '},
                  {text: this.issueDetails['agent_email'], bold: true},
                ],
                [
                  {text: 'Agent Phone: '},
                  {text: this.issueDetails['agent_phone'], bold: true},
                ],                                                           
              ]
            },
            layout: 'noBorders'
        },
        {text: 'Issue Photos', bold: true, margin: [0, 10, 0, 8]},
       {canvas: [{ type: 'line', x1: 0, y1: 1, x2: 595-2*40, y2: 1, lineWidth: 1 }]},
        {
          image: issueImg1,
          width: 200,
          margin: [0, 20, 0, 0]
        },
        {
          image: issueImg2,
          width: 200,
          margin: [0, 30, 0, 0]
        },
        {
          image: issueImg3,
          width: 200,
          margin: [0, 10, 0, 0]
        },           
        {text:"Click here for more details", link:"https://repair.smarttenant.co.uk/admin/issue-details/"+this.issueDetails['id'] + "", decoration:"underline", margin: [0, 10, 0, 0], fontSize:12}
      ],
      styles: {
        header: {fontSize: 18,bold: true,margin: [0, 0, 0, 10]},
        subheader: {fontSize: 16,bold: true,margin: [0, 10, 0, 5]},
        tableExample: {margin: [0, 5, 0, 15],border: false},
        tableHeader: {bold: true,fontSize: 13,color: 'black',border: false}
      }
    };
    // PDF without Image

      var noImg = {
      content: [
          {text: 'Issue ID: # ' + this.issueDetails['id'], fontSize: 20, bold: true, margin: [0, 20, 0, 8]},
          {text: 'Issue Type: ' + this.issueDetails['cat_name'], margin: [0, 10, 0, 10], bold: true},
          {text: 'Issue Status: ' + this.issueDetails['status'], margin: [0, 10, 0, 10], bold: true},
          {text: 'Issue Details', bold: true, margin: [0, 20, 0, 8]},
          {canvas: [{ type: 'line', x1: 0, y1: 1, x2: 595-2*40, y2: 1, lineWidth: 1 }]},
          {
            style: 'tableExample',
            table: {
              body: [
                [
                  {text: 'Address: '},
                  {text: this.titleCase(this.issueDetails['tenant_address']) + '\n '+ this.issueDetails['tenant_city'] +'\n ' + this.issueDetails['tenant_county'] + '\n' + this.issueDetails['tenant_postcode'] + '\n', bold: true},
                ],
                [
                  {text: 'Customer Name: '},
                  {text: this.titleCase(this.issueDetails['tenant_name']), bold: true},
                ], 
                [
                  {text: 'Customer Email: '},
                  {text: this.issueDetails['tenant_email'], bold: true},
                ], 
                [
                  {text: 'Customer Phone: '},
                  {text: this.issueDetails['tenant_phone'], bold: true},
                ],
                [
                  {text: 'Customer Alternate Phone: '},
                  {text: this.issueDetails['tenant_alternatephone'], bold: true},
                ],
                [
                  {text: 'Customer Type: '},
                  {text: this.titleCase(this.issueDetails['tenant_type']), bold: true},
                ],                
               /* [
                  {text: 'Vulnerable Occupiers: '},
                  {text: vulnerable, bold: true},
                ],*/
                [
                  {text: 'Issue Raised: '},
                  {text: issueraiseddate, bold: true},
                ],
                [
                  {text: 'Issue Description: '},
                  {text: this.titleCase(this.issueDetails['issue_description']), bold: true},
                ], 
                [
                  {text: 'Additional Notes: '},
                  {text: this.titleCase(this.issueDetails['additional_notes']), bold: true},
                ],
                [
                  {text: 'Manufacturer: '},
                  {text: this.titleCase(this.issueDetails['manufacturer']), bold: true},
                ],
                [
                  {text: 'Model Number: '},
                  {text: this.issueDetails['modelnumber'], bold: true},
                ],
                [
                  {text: 'Serial Number: '},
                  {text: this.issueDetails['serialnumber'], bold: true},
                ],
                [
                  {text: 'Time for Visit: '},
                  {text: visit_date, bold: true},
                ],                                                            
                [
                  {text: 'Agent Name: '},
                  {text: this.titleCase(this.issueDetails['agent_name']), bold: true},
                ],
                [
                  {text: 'Agent Email: '},
                  {text: this.issueDetails['agent_email'], bold: true},
                ],
                [
                  {text: 'Agent Phone: '},
                  {text: this.issueDetails['agent_phone'], bold: true},
                ],                                                           
              ]
            },
            layout: 'noBorders'
          },
          {text:"Click here for more details", link:"https://repair.smarttenant.co.uk/admin/issue-details/"+this.issueDetails['id'] + "", decoration:"underline", margin: [0, 10, 0, 0], fontSize:12}
      ],
      styles: {
        header: {fontSize: 18,bold: true,margin: [0, 0, 0, 10]},
        subheader: {fontSize: 16,bold: true,margin: [0, 10, 0, 5]},
        tableExample: {margin: [0, 5, 0, 15],border: false},
        tableHeader: {bold: true,fontSize: 13,color: 'black',border: false}
      }
    };
    if(issueImg != "") {
      //console.log("Yes Image");
      pdfMake.createPdf(withImg).download();
      
    }
    else {
     // console.log("No Image");
      pdfMake.createPdf(noImg).download();
    } 
     
   }
   
  //Update Issue
  updateIssue() {
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
                
        this.agent.updateIssue(this.issueEditForm.value)
        .subscribe(result => {
          if (result['status'] == "success") {
            this.isLoading = false;
            swal({
              title: 'Updated!',
              text: 'Issue has been updated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { setTimeout( function () { location.reload(); },1000)});            
          }
          else if(result['status'] == "mail error") {
            swal({
              title: 'Updated!',
              text: 'Issue has been updated. Mail not sent!',
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