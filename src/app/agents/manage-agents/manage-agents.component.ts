import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

declare var $;
declare var swal;

@Component({
  selector: 'manage-agents',
  templateUrl: './manage-agents.component.html',
  styleUrls: ['./manage-agents.component.css']
})
export class ManageAgentsComponent implements OnInit {

  agentList: any[];
  isLoading: boolean = true;

  constructor(private http: Http, private agent: AgentService, private router: Router) {
    this.loadAgentList();
    setTimeout( function () {
      $(function () {
        $('#example').DataTable({
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
        let bannercolor = localStorage.getItem('admin_banner_color');
        $(".buttons-html5").css("background", bannercolor);     
      });
    },1000);	
   }

  ngOnInit() {
  }
  editAgent(username) {
    this.router.navigate(['/admin/edit-agents', username]);
  }
  loadAgentList() {
    this.agent.getAgentList().subscribe(
      data => {
        this.agentList = data;
      }
    );
  }
  // Remove Agent 
   removeAgent(id,usename) {
    swal({
      title: 'Are you sure?',
      text: "You want to delete this agent!",
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
      this.agent.removeAgent(id,usename)
      .subscribe( result => {
        this.isLoading = false;
        if(result) {
          swal({title: 'Deleted!', text: 'Agent ' + usename + ' has been deleted.', type: 'success', confirmButtonColor: localStorage.getItem('admin_banner_color')})
          .then(() => {setTimeout( function () { location.reload(); },1000)});                  
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

  //Edit status
  confirmDialog(id,value)
  {
    let statusText;
    let statusValue = 1;
    if(value ==1) {
      statusText = "deactivate";
      statusValue = 2;
    }
    else {
      statusText = "activate";
      statusValue = 1;
    }
    swal({
      title: 'Are you sure?',
      text: "You want to " + statusText + " this agent!",
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
      this.agent.updateStatus("admin_user",statusValue,id)
      .subscribe( result => {
        if(result) {
          if(value == 1) {
            swal({
              title: 'Deactivated!',
              text: 'Agent has been deactivated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { 
               setTimeout( function () { location.reload(); },1000)                
              })           
          }
          else {
            swal({
              title: 'Activated!',
              text: 'Agent has been activated.',
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
