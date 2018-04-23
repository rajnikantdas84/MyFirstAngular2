import { SelectagentComponent } from './selectagent/selectagent.component';
import { EditcategoryComponent } from './settings/editcategory/editcategory.component';
import { AddcategoryComponent } from './settings/addcategory/addcategory.component';
import { AddadminComponent } from './settings/addadmin/addadmin.component';
import { AdminuserComponent } from './settings/adminuser/adminuser.component';
import { TenantForgotPasswordComponent } from './tenant/tenant-forgot-password/tenant-forgot-password.component';
import { AgentsettingsComponent } from './settings/agentsettings/agentsettings.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { CommentsComponent } from './tenant/comments/comments.component';
import { TenantUpdateIssueComponent } from './tenant/tenant-update-issue/tenant-update-issue.component';
import { TenantAccountInfoComponent } from './tenant/tenant-account-info/tenant-account-info.component';
import { TenantGuard } from './guard/tenant.guard';
import { TenantDashboardComponent } from './tenant/tenant-dashboard/tenant-dashboard.component';
import { TenantLoginComponent } from './tenant/tenant-login/tenant-login.component';
import { TenantRegistrationComponent } from './tenant/tenant-registration/tenant-registration.component';
import { IssueCommentsComponent } from './issue-comments/issue-comments.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForgetPasswordComponent } from './forget-password/forget-password/forget-password.component';
import { EditAgentsComponent } from './agents/edit-agents/edit-agents.component';
import { ManageAgentsComponent } from './agents/manage-agents/manage-agents.component';
import { AgentLandingComponent } from './agents/agent-landing/agent-landing.component';
import { AddAgentsComponent } from './agents/add-agents/add-agents.component';
import { AuthGuard } from './guard/auth.guard';
import { AppComponent } from './app.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { ManageCustomerComponent } from './customer/manage-customer/manage-customer.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CategoryComponent } from './settings/category/category.component';







import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { path: 'page/:username', component: AgentLandingComponent },
    { path: 'page/:username/:language', component: AgentLandingComponent },
    { path: '', component: SelectagentComponent }, // For Mobile App
    //{ path: '', component: AdminLoginComponent }, // For website
    { path: 'admin', component: AdminLoginComponent },
    { path: 'forgotpassword', component: ForgetPasswordComponent },
    { path: 'tenant-forgotpassword', component: TenantForgotPasswordComponent },
    { path: '404', component: NotFoundComponent },
    { path: 'tenant-registration/:agentuser', component: TenantRegistrationComponent},
    { path: 'tenant-login/:agentuser', component: TenantLoginComponent},
    { path: 'tenant-dashboard', component: TenantDashboardComponent, canActivate: [TenantGuard]},
    { path: 'tenant-dashboard/accountinfo', component: TenantAccountInfoComponent, canActivate: [TenantGuard]},
    { path: 'tenant-update-issue/:id', component: TenantUpdateIssueComponent, canActivate: [TenantGuard]},
    { path: 'tenant-update-issue/comments/:id', component: CommentsComponent, canActivate: [TenantGuard]},
    { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'admin/profile', component: AdminProfileComponent, canActivate: [AuthGuard]},
    { path: 'admin/add-agents', component: AddAgentsComponent, canActivate: [AuthGuard]},
    { path: 'admin/manage-agents', component: ManageAgentsComponent, canActivate: [AuthGuard]},
    //{ path: 'admin/manage-admins', component: AdminuserComponent, canActivate: [AuthGuard]},
    //{ path: 'admin/add-admin', component: AddadminComponent, canActivate: [AuthGuard]},
    { path: 'admin/edit-agents/:username', component: EditAgentsComponent, canActivate: [AuthGuard]},
	{ path: 'admin/issue-details/:id', component: IssueDetailsComponent, canActivate: [AuthGuard]},
    { path: 'admin/issue-comments/:id', component: IssueCommentsComponent, canActivate: [AuthGuard]},
    { path: 'admin/manage-customers', component: ManageCustomerComponent, canActivate: [AuthGuard]},
    { path: 'admin/customer-details/:id', component: CustomerDetailsComponent, canActivate: [AuthGuard]},
    { path: 'admin/default-settings', component: SettingsComponent, canActivate: [AuthGuard]},
    { path: 'admin/agent-settings', component: AgentsettingsComponent, canActivate: [AuthGuard]},
    { path: 'admin/category', component: CategoryComponent, canActivate: [AuthGuard]},
    { path: 'admin/add-category', component: AddcategoryComponent, canActivate: [AuthGuard]},
    { path: 'admin/edit-category/:id', component: EditcategoryComponent, canActivate: [AuthGuard]},
    { path: '**', component: SelectagentComponent}
];


