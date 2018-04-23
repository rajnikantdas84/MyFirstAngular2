import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'; 
import 'rxjs/Rx';

@Injectable()
export class AuthService {
  checkMe: any;
  constructor( private http: Http, private router: Router ) { }

  public authenticatenow(usercreds) {
    var header = new Headers();
    var creds = 'username=' + usercreds.username + '&password=' + usercreds.password;
    header.append('Content-Type', 'application/X-www-form-urlencoded');
    return this.http.post('https://smarttenant.co.uk/_helper/admin/login', creds, {headers: header})
	//return this.http.post('https://repair.smarttenant.co.in/admin/login', creds, {headers: header})
    .map((response: Response) => {
    let result = response.json();
    if (result) {
      localStorage.setItem('auth_key', result.username);
      localStorage.setItem('name',result.name);
	    localStorage.setItem('auth_token',result.token);
      localStorage.setItem('admin_role',result.user_role);
      localStorage.setItem('userid',result.id);
      return result;
    }
    else return false; 
    });
  }

  getIssue() {  
    var header = new Headers();
	  var username = localStorage.getItem('auth_key');
	  var auth_token = localStorage.getItem('auth_token');
    var creds = 'username=' + username + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/admin/getAdminIssue', creds, {headers: header})
	  //return this.http.post('https://repair.smarttenant.co.in/admin/getAdminIssue', creds, {headers: header})
	  .map(res =>res.json());
  }

    getIssueBySearch(status,fromdate,todate,userid) { 
    var header = new Headers();
	  var username = localStorage.getItem('auth_key');
    var adminrole = localStorage.getItem('admin_role');
	  var auth_token = localStorage.getItem('auth_token');
    var creds = 'username=' + username + '&auth_token=' + auth_token + '&adminrole=' + adminrole + '&status=' + status + '&fromdate=' + fromdate + '&todate=' + todate + '&userid=' + userid;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/admin/getIssueBySearch', creds, {headers: header})
	  .map(res =>res.json());
  }

  getAgentIssue(agentid) {
    var header = new Headers();
	  var username = localStorage.getItem('auth_key');
  	var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");     // Replace the "+" sign to hexcode so that URL decoder can read this correctly.
    var creds = 'agentid=' + agentid + '&username=' + username + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/admin/getAgentIssue', creds, {headers: header})
	  .map(res =>res.json());
  }  

  logout() {
    localStorage.removeItem('auth_key');
    localStorage.removeItem('name');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_banner_color');
    this.router.navigate(['admin']);
	
  }

  forgotPassword(value) {
    var header = new Headers();
    var creds = 'email=' + value.forgotemail;
    header.append('Content-Type', 'application/X-www-form-urlencoded');
		return this.http.post('https://smarttenant.co.uk/_helper/admin/resetPassword', creds, {headers: header})
		//return this.http.post('https://repair.smarttenant.co.in/admin/resetPassword', creds, {headers: header})
	  .map(res =>res.json());
  }
  
  tenantForgotPassword(value) {
    var header = new Headers();
    var creds = 'email=' + value.forgotemail;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
		return this.http.post('https://smarttenant.co.uk/_helper/tenant/resetPassword', creds, {headers: header})
	  .map(res =>res.json());
  }

}


