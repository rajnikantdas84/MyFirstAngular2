import { Component, OnInit } from '@angular/core';
import { AgentService } from './../../services/agent.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgStyle, DatePipe } from '@angular/common';


declare var $;

@Component({
  selector: 'app-tenant-dashboard',
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css']
})
export class TenantDashboardComponent implements OnInit {

  tenantDetails: any[];
  tenantName = "";
  agentUsername = "";
  recentIssue: boolean = false;
  recentIssueDetails: any[];
  records: any[];
  bannercolor: string;
  constructor(private activateroute: ActivatedRoute, private agent: AgentService, private router: Router) { 
    let email = localStorage.getItem('customer_key');
    this.getTenantDetails(email);
    this.getTenantIssue(email);

   $(document).on('click','#adv-search', function(event){
      $('#fromdatetimepicker').datetimepicker({defaultDate: new Date()});
      //$('#todatetimepicker').datetimepicker({  defaultDate: new Date()});
      $('#todatetimepicker').datetimepicker({defaultDate: new Date()});
    });
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
      let banner_color = localStorage.getItem('bannercolor');
      $(".buttons-html5").css("background", banner_color);
      $("#clearbtn").css("background", banner_color);
      $("#clearbtn").css("border-color", banner_color);
      $("#submitissue").css("background", banner_color);
      $("#submitissue").css("border-color", banner_color);   
      $("#submitissue").click(function() {
      //Creating of our own filtering function
      $.fn.dataTableExt.afnFiltering.push(
          function(oSettings, aData, iDataIndex) {
           // console.log(aData);
            var fromdate = new Date ( $('#fromdate').val() );
            var todate = new Date ( $('#todate').val() );
            var evalDate = new Date ( aData[1] );
            var issuestatus = $('#issuestatus').val();
            var evalStatus = aData[6];
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
  onMouseOut($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
    //console.log("mouseout");
   //  console.log($value);

  }
  onMouseOver($value) {
    $("#"+$value).css("background-color", this.bannercolor);
    $("#"+$value).css("border-color", this.bannercolor);
    // console.log("mouseover");
     // console.log($value);
  }
  ngOnInit() {
    this.agentUsername =  localStorage.getItem('agent_url');
    this.bannercolor = localStorage.getItem('bannercolor');
    
   $(function () {
     $(".buttons-html5").css("background-color", this.bannercolor);
      var i=182;
      $('#js-heightControl').css('min-height', $(window).height() - i+'px');
    });    
  }
   resetForm() {
     location.reload();
   }
   editIssue(id) {
    this.router.navigate(['/tenant-update-issue', id]);
   }
  getTenantDetails(email) {
    this.agent.getTenantData(email)
    .subscribe(data => { 
        this.tenantDetails = data;
        this.tenantName = this.tenantDetails['name'];
        //this.agentUsername = this.tenantDetails['agentuser'];
      }
    );
  }

  //Fetch Tenant Issue;
  getTenantIssue(email) {
      this.agent.getTenantIssue(email)
      .subscribe(result => {
        if(result) {
          this.records = result;
          this.recentIssueDetails = result[0];
          this.recentIssue = true;
        }        
      });    
  }

}
