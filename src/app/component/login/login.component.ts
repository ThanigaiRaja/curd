import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login/login.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
  constructor(
	private router: Router,
	private route: ActivatedRoute,
	private loginserve: LoginService,
	private toastra: ToastrService,
  ) { }

	formGroup: FormGroup;
	createform: FormGroup;
	show:boolean;
	Loader:Boolean;

  	ngOnInit() {
		this.CreateForm();
  	}

  	CreateForm() {
    	this.formGroup = new FormGroup({
        	email: new FormControl('', [Validators.required, Validators.email]),
        	password: new FormControl('', [Validators.required])
    	});
	}

	ShowPass(){
		this.show = !this.show;
		if(this.show){
			$('#password').attr('type','text')
		}else{
			$('#password').attr('type','password');
		}
	}

	Login() {
		let loginData = this.formGroup.value;
		let formData = new FormData();
	   Object.keys(loginData).forEach(key => formData.append(key, loginData[key]));
	  	this.Loader = true;
		this.loginserve.GoLogin(formData).then((res) => {
			this.Loader = false;
			let login = res.json().data;
			if(res.json().status == "success"){
				sessionStorage.setItem('token', res.json().data.token);
			 	this.router.navigateByUrl('eventdashboard');
			}
		}, error => {
			this.Loader = false;
			if (error.json().status_code == 400) {
				let get_err = error.json().message;
				Object.keys(get_err).forEach(
					key => this.toastra.error(get_err[key][0])
				);
			} else{
				let get_err = error.json().message;
				this.toastra.error(get_err);
			}
		});
	}
	

}
