import { Component, OnInit } from '@angular/core';
import { AgentService } from './../../services/agent.service';

declare var $;
declare var swal;

@Component({
  selector: 'app-adminuser',
  templateUrl: './adminuser.component.html',
  styleUrls: ['./adminuser.component.css']
})


export class AdminuserComponent implements OnInit {

  agentList: any[];
  constructor(private agent: AgentService) {
    this.loadAgentList();
    setTimeout( function () {
      $(function () {
        $('#example').DataTable({
          "order": [[ 0, "desc" ]],
          language: {
              searchPlaceholder: "Search Records..."
          }          
        });
        $("#example_filter").detach().appendTo('#new-search-area');
        $('div.dataTables_filter input').addClass('table-search');
      });
    },1000);	
   }

  ngOnInit() {
  }
  loadAgentList() {
    this.agent.getAgentList().subscribe(
      data => {
        this.agentList = data;
      }
    );
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
              type: 'success'
             }).then(() => { 
               setTimeout( function () { location.reload(); },1000)                
              })           
          }
          else {
            swal({
              title: 'Activated!',
              text: 'Agent has been activated.',
              type: 'success'
             }).then(() => { 
               setTimeout( function () { location.reload(); },1000)                
              })            
          }          
        }
        else {
          swal('Error!','Try again later.','error')
        }        
      });
    },
      function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'
      if (dismiss === 'cancel') {
        swal('Cancelled','No action performed!','error')
      }
    })//then closing
  } // Confirm Dialog Closing      
}
