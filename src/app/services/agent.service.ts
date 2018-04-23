import { AgentUser } from './../_helper/agent-user';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map'; 
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { GlobalValues } from './../_helper/global';

@Injectable()
export class AgentService {

  constructor(private http: Http) { }

  saveUser(info){
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    info['auth_token'] = auth_token;
    info['auth_key'] = auth_key;
    return this.http.post("https://smarttenant.co.uk/_helper/admin/saveUser",info).map(res=>res.json());
  }
  saveAdmin(info){
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    info['auth_token'] = auth_token;
    info['auth_key'] = auth_key;
    return this.http.post("https://smarttenant.co.uk/_helper/admin/saveAdmin",info).map(res=>res.json());
  }

  getCity(zipcode) {
    var header = new Headers();
    var creds = 'address=' + zipcode +'&sensor=true';
    header.append('Content-Type', 'application/X-www-form-urlencoded');
	  return this.http.get('https://api.postcodes.io/postcodes/' + zipcode).map(res=>res.json());
    //return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + zipcode + '&sensor=true&key= AIzaSyAylGN_TatG7OoFAWC07Ni1xqxpvMOMuo0')
        
  }
  saveTenant(info){
    return this.http.post("https://smarttenant.co.uk/_helper/tenant/saveTenant",info).map(res=>res.json());   
  }

  updateInfo(info) {
    return this.http.post("https://smarttenant.co.uk/_helper/admin/updateProfile", info).map(res=>res.json());
  }

  updateCustomerInfo(info) {
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    info['auth_token'] = auth_token;
    info['auth_key'] = auth_key;
    return this.http.post("https://smarttenant.co.uk/_helper/admin/updateCustomerInfo",info).map(res=>res.json());
  }

  updateTenantInfo(info) {
    var customer_token = localStorage.getItem('customer_token');
    customer_token = customer_token.replace(/\+/g, "%2b");
    info['token'] = customer_token;  
    return this.http.post("https://smarttenant.co.uk/_helper/tenant/updateTenantInfo",info).map(res=>res.json());
  }

  updateIssue(info) {
    info['auth_token'] = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post("https://smarttenant.co.uk/_helper/admin/updateIssue",info).map(res=>res.json());
  }  

  isUsernameExist(username: string) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post('https://smarttenant.co.uk/_helper/admin/isUsernameExist', JSON.stringify({ username: username, token: token }), { headers: headers })
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }

  isEmailExist(email: string) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post('https://smarttenant.co.uk/_helper/admin/isEmailExist', JSON.stringify({ email: email, token: token }), { headers: headers })
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }

  isCustomerEmailExist(email: string) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post('https://smarttenant.co.uk/_helper/tenant/isCustomerEmailExist', JSON.stringify({ email: email, token: token }), { headers: headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.log(error);
    return Observable.throw(error.json());
  }

  getLanguageList() {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getLanguageList', creds, {headers: header})
    .map(res => res.json());
  }

  getParentCategories() {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getParentCategories', creds, {headers: header})
    .map(res => res.json());
  }  
  getSubCategories(id) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'id=' + id + '&token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
    return this.http.post('https://smarttenant.co.uk/_helper/admin/getSubCategories', creds, {headers: header})
    .map(res => res.json());	
  }
  
  updateStatus(table,value,id) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'table=' + table +'&id=' + id + '&value=' + value + '&token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded');
    return this.http.post('https://smarttenant.co.uk/_helper/admin/updateStatus', creds, {headers: header})//return this.http.post('https://80ort.com/updatestatus.php', creds, {headers: header})
    .map(res => res.json());  
  }

  removeIssue(id) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = '&id=' + id +  '&token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/admin/removeIssue', creds, {headers: header})
	  .map(res =>res.json());   
  }

  removeAgent(id,username) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = '&id=' + id +  '&token=' + token + '&username=' + username;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/admin/removeAgent', creds, {headers: header})
	  .map(res =>res.json());   
  }

  removeTenant(id,name) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = '&id=' + id +  '&token=' + token+ '&name=' + name;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/admin/removeTenant', creds, {headers: header})
	  .map(res =>res.json());   
  }  

  getLanguageName(code) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'code=' + code + '&token=' + token;    
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
    return this.http.post('https://smarttenant.co.uk/_helper/admin/getLanguageName', creds, {headers: header})
    .map(res => res.json());  
  }  
  
  getPageSettings(username) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'username=' + username + '&token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded');
    return this.http.post('https://smarttenant.co.uk/_helper/admin/getPageSettings', creds, {headers: header})
    .map(res => res.json());    
  }

  updateSettings(info) {
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    info['auth_key'] = auth_key;
    info['auth_token'] = auth_token;
    return this.http.post("https://smarttenant.co.uk/_helper/admin/updateSettings",info).map(res=>res.json());
  }

  getAgentList() {
    var header = new Headers();
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    var creds = 'auth_key=' + auth_key + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getAgentList', creds, {headers: header})
    .map(res => res.json());
  }
  
  getCustomerList() {
    var header = new Headers();
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    var creds = 'auth_key=' + auth_key + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getCustomerList', creds, {headers: header})
    .map(res => res.json());
  }

  getCustomerDetails(id) {
    var header = new Headers();
    var auth_token = localStorage.getItem('auth_token');
    auth_token = auth_token.replace(/\+/g, "%2b");
    var auth_key = localStorage.getItem('auth_key');
    var creds = 'id=' + id + '&auth_token=' + auth_token + '&auth_key=' + auth_key;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getCustomerDetails', creds, {headers: header})
    .map(res => res.json());    
  }
  getAgentDetails(username) {
    var header = new Headers();
    var auth_token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'username=' + username + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	//console.log(username);
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getAgentDetails', creds, {headers: header})
    .map(res => res.json());
  }

  getTenantData(email) {
    var header = new Headers();
    var customer_token = localStorage.getItem('customer_token');
    //console.log("First", customer_token);
    let customer_token2 = customer_token.replace("+", "%2b");
   // console.log(customer_token2);
    var creds = 'email=' + email + '&token=' + customer_token2;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/tenant/getTenantData', creds, {headers: header})
    .map(res => res.json());
  }

  getTenantIssue(email) {
    var header = new Headers();
    var customer_token = localStorage.getItem('customer_token');
    customer_token = customer_token.replace(/\+/g, "%2b");
    var creds = 'email=' + email + '&token=' + customer_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded');     
	  return this.http.post('https://smarttenant.co.uk/_helper/tenant/getTenantIssue', creds, {headers: header})
	  .map(res =>res.json());
  } 


    getIssueDetails(id) {
    var header = new Headers();
    var auth_token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'id=' + id + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	//console.log(username);
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getIssueDetails', creds, {headers: header})
    .map(res => res.json());
  }
  
    getIssueUpdateDetails(id) {
    var header = new Headers();
    var auth_token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'id=' + id + '&auth_token=' + auth_token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getIssueUpdateDetails', creds, {headers: header})
    .map(res => res.json());
  }
  getCategories() {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getCategories', creds, {headers: header})
    .map(res => res.json());
  }

  getAdminEnabledCategories() {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getAdminEnabledCategories', creds, {headers: header})
    .map(res => res.json());
  }  

  getEditCategories(catid) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token + '&catid=' + catid;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getCategories', creds, {headers: header})
    .map(res => res.json());
  }  
  // Update Category

  updateCategory(info) {
    info['auth_token'] = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post("https://smarttenant.co.uk/_helper/admin/updateCategory",info).map(res=>res.json());
  } 

  // Add Category

  saveCategory(info) {
    info['auth_token'] = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post("https://smarttenant.co.uk/_helper/admin/saveCategory",info).map(res=>res.json());
  }   

  updateCategoryStatus(value,id,userrole,userid) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'id=' + id + '&value=' + value + '&token=' + token + '&userrole=' + userrole + '&userid=' + userid;
    header.append('Content-Type', 'application/X-www-form-urlencoded');
    return this.http.post('https://smarttenant.co.uk/_helper/admin/updateCategoryStatus', creds, {headers: header})//return this.http.post('https://80ort.com/updatestatus.php', creds, {headers: header})
    .map(res => res.json());  
  }
  getCategoryById(catid) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token + '&catid=' + catid;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getCategoryById', creds, {headers: header})
    .map(res => res.json());
  }  

  getAgentDisabledCatList(agentid) {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token + '&agentid=' + agentid;
    header.append('Content-Type', 'application/X-www-form-urlencoded');
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getAgentDisabledCatList', creds, {headers: header})
    .map(res => res.json());
  }
  
  saveIssue(info) {
    info['auth_token'] = btoa(GlobalValues.ACCESSTOKENVALUE);
    return this.http.post("https://smarttenant.co.uk/_helper/admin/saveIssue",info).map(res=>res.json());

  }

  removeimage(info) {
    var header = new Headers();
    var creds = 'imagename=' + info;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
   	return this.http.post('https://repair.smarttenant.co.uk/uploadimages/removelogoimage.php', creds, {headers: header})
    .map(res => res.json());

  }

  removecategoryimage(info) {
    var header = new Headers();
    var creds = 'imagename=' + info;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
   	return this.http.post('https://repair.smarttenant.co.uk/uploadimages/removecategoryimage.php', creds, {headers: header})
    .map(res => res.json());

  }  
  public authenticateTenant(usercreds) {
    var header = new Headers();
    var creds = 'email=' + usercreds.email + '&password=' + usercreds.password;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
		return this.http.post('https://smarttenant.co.uk/_helper/tenant/login', creds, {headers: header})
    .map((response: Response) => {
    let result = response.json();
    if (result) {
      localStorage.setItem('customer_key', result.email);
      localStorage.setItem('customer_name',result.name);
      localStorage.setItem('customer_token',result.token);
      return result;
    }
    else return false; 
    });
  }

  getAllAgentList() {
    var header = new Headers();
    var token = btoa(GlobalValues.ACCESSTOKENVALUE);
    var creds = 'token=' + token;
    header.append('Content-Type', 'application/X-www-form-urlencoded'); 
  	return this.http.post('https://smarttenant.co.uk/_helper/admin/getAllAgentList', creds, {headers: header})
    .map(res => res.json());
  }   
}
