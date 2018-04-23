import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AgentService } from './../services/agent.service';
import { AuthService } from './../services/auth.service';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

declare var $;
declare var swal;

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {

  records : any[];
  agentid;
  searchvalue: boolean = false;
  isLoading: boolean = true;
  isAdmin: boolean = true;
  bannercolor: string;
  constructor( private data: AuthService, private agent: AgentService, private router: Router, private datepipe: DatePipe ) {
   
    this.LoadTableData();   
    this.agent.getPageSettings(localStorage.getItem('auth_key'))
    .subscribe(result => {
      //console.log(result);
        localStorage.setItem('admin_banner_color', result.banner_color);
    }); 
    setTimeout( function () {
      $(function () {
        
        $('#fromdatetimepicker').datetimepicker({defaultDate: new Date()});
        //$('#todatetimepicker').datetimepicker({  defaultDate: new Date()});
        $('#todatetimepicker').datetimepicker({defaultDate: new Date()});
      });      
    },1000);


    // Appllied setTimeout() function to delay the DataTables load time.
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
                searchPlaceholder: "Search Records..."
            }        
          });        
          $("#example_filter").detach().appendTo('#new-search-area');
          $('div.dataTables_filter input').addClass('table-search');
          let banner_color = localStorage.getItem('admin_banner_color');
          $(".buttons-html5").css("background", banner_color);
          $("#clearbtn").css("background", banner_color);
          $("#clearbtn").css("border-color", banner_color);
          $("#submitissue").css("background", banner_color);
          $("#submitissue").css("border-color", banner_color);
         // this.bannercolor = localStorage.getItem('admin_banner_color');
          $("#submitissue").click(function() {
            //Creating of our own filtering function
            $.fn.dataTableExt.afnFiltering.push(
                function(oSettings, aData, iDataIndex) {
                /* var fromdate = moment($('#fromdate').val()).format('DD-MM-YYYY'); 
                 var fromdate2 = moment($('#fromdate').val()).format("MMM Do YY"); 
                 console.log("from2 "+ fromdate2);
                  var todate = moment($('#todate').val()).format('DD-MM-YYYY');
                  var evalDate = moment(aData[1]).format('DD-MM-YYYY');
                  
                  var todate2 = moment($('#todate').val()).format('MMM Do YY'); console.log("todate2 "+ todate2);
                  var evalDate2= moment(aData[1]).format('MMM Do YY'); console.log("eval2 "+ evalDate2);*/
                  var fromdate = new Date ( $('#fromdate').val() );
                  var todate = new Date ( $('#todate').val() );
                 // let tableDate = this.datepipe.transform(aData[1], 'dd-MM-yy hh:mm:ss');
                  var evalDate = new Date ( aData[1] );
                  var issuestatus = $('#issuestatus').val();
                  var evalStatus = aData[7];
                  if(issuestatus == "All") {
                    if(evalDate.getTime() >= fromdate.getTime() && evalDate.getTime() <= todate.getTime()) { 
                     // console.log("true");
                      return true;
                    }
                    else { 
                     // console.log("false");
                      return false;
                    }                
                  }
                  else {
                    if(evalDate.getTime() >= fromdate.getTime() && evalDate.getTime() <= todate.getTime() && evalStatus == issuestatus) {
                      //console.log("true");
                      return true;
                    }
                    else { 
                      //console.log("false");
                      return false;
                    }                

                   }

                  }
                );
                //Update table
                table.draw();
                //Deleting the filtering function if we need the original table later.
                 $.fn.dataTableExt.afnFiltering.pop();
              });
            });
      },1000);
   }
   editIssue(id) {
    this.router.navigate(['/admin/issue-details', id]);
   }
   removeIssue(id) {
    swal({
      title: 'Are you sure?',
      text: "You want to delete this issue!",
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
      this.agent.removeIssue(id)
      .subscribe( result => {
        this.isLoading = false;
        if(result) {
          swal({title: 'Deleted!', text: 'Issue id # '+ id +' has been deleted.', type: 'success', confirmButtonColor: localStorage.getItem('admin_banner_color')})
          .then(() => {setTimeout( function () { location.reload(); },1000)});                  
        }
        else {
          swal({
            title: 'Error!',
            text: 'Try again later.',
            type: 'error',
            confirmButtonColor: localStorage.getItem('admin_banner_color')
          });
        }        
      });
    },
      function (dismiss) {
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

   resetForm() {
     location.reload();
   }
  ngOnInit() {
    this.bannercolor = localStorage.getItem('admin_banner_color');
  }

  LoadTableData() {
    if(localStorage.getItem('admin_role') == "1" || localStorage.getItem('admin_role') == "2" ) {
      this.data.getIssue().subscribe(result => {this.records = result;});
    }
    else {
      this.agent.getAgentDetails(localStorage.getItem('auth_key')).subscribe(result => {
        this.isAdmin = false;
        this.data.getAgentIssue(result.id).subscribe(result => { this.records = result;});
      });      
    }
  }
  
}
