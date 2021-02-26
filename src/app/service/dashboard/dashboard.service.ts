import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

	constructor(private http: Http) { }

  	private APIURL: string = environment.apiUrl;

	
	get_all_user() {
        let url: string = `${this.APIURL}/get_all_user`;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.get(url, { headers: headers }).toPromise();
    }

	get_all_user_by_id(id) {
        let url: string = `${this.APIURL}/get_all_user_by_id/`+id;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.get(url, { headers: headers }).toPromise();
    }

	delete_user_by_id(id){
		let url: string = `${this.APIURL}/delete_user_by_id/`+id;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.get(url, { headers: headers }).toPromise();
	}

	create_user(data){
		let url: string = `${this.APIURL}/create_user`;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.post(url,data,{ headers: headers }).toPromise();
	}

	update_user(data){
		let url: string = `${this.APIURL}/update_user`;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.post(url,data,{ headers: headers }).toPromise();
	}

    search_user_list(data){
		let url: string = `${this.APIURL}/search_user/`+data;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.get(url,{ headers: headers }).toPromise();
	}
}
