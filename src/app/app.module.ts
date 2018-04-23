import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { GlobalValues } from './_helper/global';
import { DatePipe } from '@angular/common';
import { CustomValidators } from './_helper/custom.validator';
import { AgentService } from './services/agent.service';
import { AuthGuard } from './guard/auth.guard';
import { TenantGuard } from './guard/tenant.guard';
import { appRouting } from './app.routing';
import { Http, HttpModule } from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthService } from './services/auth.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueComponent } from './issue/issue.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AddAgentsComponent } from './agents/add-agents/add-agents.component';
import { AgentLandingComponent } from './agents/agent-landing/agent-landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgentLandingHeaderComponent } from './agents/agent-landing-header/agent-landing-header.component';
import { AgentLandingFooterComponent } from './agents/agent-landing-footer/agent-landing-footer.component';
import { ManageAgentsComponent } from './agents/manage-agents/manage-agents.component';
import { EditAgentsComponent } from './agents/edit-agents/edit-agents.component';
import { ForgetPasswordComponent } from './forget-password/forget-password/forget-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { IssueCommentsComponent } from './issue-comments/issue-comments.component';
//import { ImagedirectiveDirective } from './directives/imagedirective.directive';
//import { FileUploadModule } from 'ng2-file-upload';
import { TenantRegistrationComponent } from './tenant/tenant-registration/tenant-registration.component';
import { TenantLoginComponent } from './tenant/tenant-login/tenant-login.component';
import { TenantDashboardComponent } from './tenant/tenant-dashboard/tenant-dashboard.component';
import { TenantAccountInfoComponent } from './tenant/tenant-account-info/tenant-account-info.component';
import { TenantUpdateIssueComponent } from './tenant/tenant-update-issue/tenant-update-issue.component';
import { CommentsComponent } from './tenant/comments/comments.component';
import { ManageCustomerComponent } from './customer/manage-customer/manage-customer.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';


import { ParseUrl } from './parse-url.pipe';
import { DynamicContent }  from './dynamic-content.directive';
import { DropzoneModule, DropzoneConfig, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import { ActivesidebarDirective } from './directives/activesidebar.directive';
import { SettingsComponent } from './settings/settings/settings.component';
import { AgentsettingsComponent } from './settings/agentsettings/agentsettings.component';
import { CategoryComponent } from './settings/category/category.component';
import { TenantForgotPasswordComponent } from './tenant/tenant-forgot-password/tenant-forgot-password.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { AdminuserComponent } from './settings/adminuser/adminuser.component';
import { AddadminComponent } from './settings/addadmin/addadmin.component';
import { MomentModule } from 'angular2-moment';
import { AddcategoryComponent } from './settings/addcategory/addcategory.component';
import { EditcategoryComponent } from './settings/editcategory/editcategory.component';
import { SelectagentComponent } from './selectagent/selectagent.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


const DROPZONE_CONFIG : DropzoneConfigInterface = {
    url: 'http://repair.smarttenant.co.uk/uploadimages/fileupload.php',
  //Library options

 // server: 'https://httpbin.org/post',   // Server url for sending the upload request (Default: '').
  params: null,                         // Url parameters to be added to the server url (Default: null).
  autoReset: null,                      // Time for resetting upload area after upload (Default: null).
  errorReset: null,                     // Time for resetting upload area after an error (Default: null).
  cancelReset: null,                    // Time for resetting upload area after canceling (Default: null).

  //Dropzone options

  method: 'post',                       // HTTP method to use communicating with the server (Default: 'post').
  headers: {"additional":"header"},     // Object of additional headers to send to the server (Default: null).
  paramName: 'file',                    // Name of the file parameter that gets transferred (Default: 'file').
  maxFilesize: 6,                       // Maximum file size for the upload files in megabytes (Default: null).
  acceptedFiles: 'image/*',             // Comma separated list of mime types or file extensions (Default: null).
  addRemoveLinks: true,
  clickable: true,
  dictDefaultMessage: "Upload Image",
  maxFiles: 3,
  thumbnailWidth: 200,
  thumbnailHeight: 200
};


@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    SideBarComponent,
    TopBarComponent,
    DashboardComponent,
    IssueComponent,
    AdminProfileComponent,
    AddAgentsComponent,
    AgentLandingComponent,
    AgentLandingHeaderComponent,
    AgentLandingFooterComponent,
    ManageAgentsComponent,
    EditAgentsComponent,
    ForgetPasswordComponent,
    NotFoundComponent,
    IssueDetailsComponent,
    IssueCommentsComponent,
   // ImagedirectiveDirective,
    TenantRegistrationComponent,
    TenantLoginComponent,
    TenantDashboardComponent,
    TenantAccountInfoComponent,
    TenantUpdateIssueComponent,
    CommentsComponent,
    ManageCustomerComponent,
    CustomerDetailsComponent,
    ActivesidebarDirective,
    SettingsComponent,
    AgentsettingsComponent,
    CategoryComponent,
    TenantForgotPasswordComponent,
    AdminuserComponent,
    AddadminComponent,
    AddcategoryComponent,
    EditcategoryComponent,
    SelectagentComponent,
    ParseUrl,
    DynamicContent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    appRouting,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    NguiDatetimePickerModule,
    MomentModule,
    //NguiDatetimePickerModule,
     // FileUploadModule    
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    AuthService,
    HttpClient,
    AuthGuard,
    TenantGuard,
    AgentService,
    CustomValidators,
    AdminLoginComponent,
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
