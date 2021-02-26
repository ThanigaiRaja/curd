import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  	constructor(private http: Http) { }

  	private APIURL: string = environment.apiUrl;

  	GoLogin(data) {
    	let url: string = `${this.APIURL}/login`;
    	return this.http.post(url, data).toPromise();
  	}

	  GoLogout() {
        let url: string = `${this.APIURL}/logout`;
        let headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('token') });
        return this.http.get(url, { headers: headers }).toPromise();
    }

}
