import { AuthService } from './../../services/auth.service';
import { GlobalValues } from './../../_helper/global';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { AgentService } from './../../services/agent.service';
import { DropzoneModule, DropzoneConfig, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import { Router } from '@angular/router';


declare var swal: any;
declare var $;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})


export class CategoryComponent implements OnInit {
  parentCatList: any;
  categoryList: any[] = [];
  isLoading: boolean = true;
  siteurl: string;
  isAdmin: boolean = false;
  disabledCatList: any[];
  records: any[];
  disabledArray: any[] = [];

  constructor(formbuilder: FormBuilder, private agent:AgentService, private data: AuthService, private router: Router) {
    this.siteurl = GlobalValues.SITEURL;
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
editCategory(id) {
this.router.navigate(['/admin/edit-category', id]);
}
  ngOnInit() {
  // Get All Disabled Category for the current agent
  this.agent.getAgentDisabledCatList(localStorage.getItem('userid'))
  .subscribe( (data) => {
    this.disabledArray = data;
  });

    if(localStorage.getItem('admin_role') == "1") {
      this.isAdmin = true;
      // Category List for Master Admin
      this.agent.getCategories()
      .subscribe( result => {
        if(result) {
          for (let entry of result) {
            this.agent.getCategoryById(entry.parent)
            .subscribe(data => {
                if(data) {
                  entry.parentname= data[0].cat_name;
                }
            });           
          // console.log(entry);
          this.categoryList.push(entry);
          }
          //console.log(this.categoryList);
        }
      });      
    }
    else {
      this.agent.getAdminEnabledCategories()
      .subscribe( result => {
        if(result) {
          let UpdatedArray: any[] = [];
         for (let entry of result) {
            let value: any;
            value = this.checkDisabledArray(entry.cat_id);
            if(value !== 1) {
              entry.status = 0;
            }
            UpdatedArray.push(entry);
            //this.categoryList.push(entry);
          }
          for( let arrValue of UpdatedArray ) {
            this.agent.getCategoryById(arrValue.parent)
            .subscribe(data => {
                if(data) {
                  arrValue.parentname= data[0].cat_name;
                }
            });
          this.categoryList.push(arrValue);            
          }
         console.log(this.categoryList);
        }
      });      
    }  

      setTimeout( function () {
        $(function () {
          var table = $('#example').DataTable({
            "order": [[ 0, "desc" ]],
            dom: 'lBfrtip',
            buttons: [
              //'copy', 'csv', 'excel', 'pdf', 'print'
              'csv','excel'
            ],
            language: {
                searchPlaceholder: "Search Categories..."
            }        
          });        
          $("#example_filter").detach().appendTo('#new-search-area');
          $('div.dataTables_filter input').addClass('table-search');
          let banner_color = localStorage.getItem('admin_banner_color');
          $(".buttons-html5").css("background", banner_color);
          $(".admin-add-btn").css("background", banner_color);
          $(".admin-add-btn").css("border-color", banner_color);
        });
      },1000);
  }

  // Activate/Deactivate Category

  confirmDialog(id,value)
  {
    let statusText;
    let statusValue = 1;
    if(value ==1) {
      statusText = "deactivate";
      statusValue = 0;
    }
    else {
      statusText = "activate";
      statusValue = 1;
    }
    swal({
      title: 'Are you sure?',
      text: "You want to " + statusText + " this category!",
     //text: "ID " + id + "Value= " + value ,
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
      this.agent.updateCategoryStatus(statusValue,id,localStorage.getItem('admin_role'),localStorage.getItem('userid'))
      .subscribe( result => {
        if(result) {
          this.isLoading = false;      
          if(value == 1) {
            swal({
              title: 'Deactivated!',
              text: 'Category has been deactivated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { 
               setTimeout( function () { location.reload(); },1000)                
              })           
          }
          else {
            swal({
              title: 'Activated!',
              text: 'Category has been activated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { 
               setTimeout( function () { location.reload(); },1000)                
              })            
          }          
        }
        else {
          swal({
            title: 'Error!',
            text: 'Try again later',
            type: 'error',
            confirmButtonColor: localStorage.getItem('admin_banner_color')
          });          
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
  } // Confirm Dialog Closing  

}
