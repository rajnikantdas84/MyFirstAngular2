import { Router } from '@angular/router';
import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';

declare var $;
declare var swal;

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.css']
})
export class ManageCustomerComponent implements OnInit {

  customerList: any[];
  customer_status: any;
  isLoading: boolean = true;

  constructor(private agent: AgentService, private router: Router) {
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

    this.agent.getCustomerList().subscribe(
      data => {
        this.customerList = data;
      }
    );  

   }

  ngOnInit() {
  }
  // Remove Tenant 
   removeTenant(id,name) {
    swal({
      title: 'Are you sure?',
      text: "You want to delete this tenant!",
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
      this.agent.removeTenant(id,name)
      .subscribe( result => {
        this.isLoading = false;
        if(result) {
          swal({title: 'Deleted!', text: 'Customer ' + name + ' has been deleted.', type: 'success', confirmButtonColor: localStorage.getItem('admin_banner_color')})
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

  editCustomer(id) {
    this.router.navigate(['/admin/customer-details', id]);
  }
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
      text: "You want to " + statusText + " this customer!",
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
      this.agent.updateStatus("tenants",statusValue,id)
      .subscribe( result => {
        if(result) {
          if(value == 1) {
            swal({
              title: 'Deactivated!',
              text: 'Customer has been deactivated.',
              type: 'success',
              confirmButtonColor: localStorage.getItem('admin_banner_color')
             }).then(() => { 
               setTimeout( function () { location.reload(); },1000)                
              })           
          }
          else {
            swal({
              title: 'Activated!',
              text: 'Customer has been activated.',
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
