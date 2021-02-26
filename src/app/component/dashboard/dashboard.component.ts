import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	constructor(
	  	private dashboardserve: DashboardService,
	  	private toastra: ToastrService,
  	) { }

	show:boolean;
	Loader:Boolean;
	all_user:any;
	selected_user_name :any;
	selected_email :any;
	selected_phone :any;
	selected_company_name:any;
	selected_address:any;
	selected_id :any;
	createuser:boolean;
	create_contact:boolean=false;
	edituser:boolean=false;
	formGroup: FormGroup;
	searchuser_list:boolean=true;

	ngOnInit() {
    	$(".top").css("display", "block");
    	this.get_user();
  	}

	CreateForm(id){
    	this.formGroup = new FormGroup({
			user_name : new FormControl('', [Validators.required]),
			user_email : new FormControl('', [Validators.required, Validators.email]),
			user_company_name: new FormControl('', [Validators.required]),
			phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
			user_address: new FormControl('', [Validators.required]),
			id: new FormControl(id),
		});

		if(id == 1){
			this.create_contact = true;
			this.createuser =true;
			this.edituser = false;

		}else{
			this.create_contact = true;
			this.createuser =true;
			this.edituser = true;
			this.get_user_by_id(id,null);
		}
	}


	get_user(){
		this.Loader = true;
		this.dashboardserve.get_all_user().then((res) => {
			this.Loader = false;
			this.all_user = res.json().data;
			this.get_user_by_id(res.json().data[0].id,null);
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

	cancel_input(){
		this.get_user_by_id(this.selected_id,null);
		this.edituser = false;
	}

	get_user_by_id(id,value){
		this.Loader = true;
		this.create_contact = false;
		this.dashboardserve.get_all_user_by_id(id).then((res) => {
			this.Loader = false;
			this.selected_user_name = res.json().data.user_name;
			this.selected_email = res.json().data.email;
			this.selected_phone = res.json().data.phone;
			this.selected_company_name = res.json().data.company_name;
			this.selected_address = res.json().data.address;
			this.selected_id = res.json().data.id;
			if(this.edituser ==true && value == null){
				this.create_contact = true;
				this.formGroup.controls['user_name'].setValue(res.json().data.user_name);
				this.formGroup.controls['user_email'].setValue(res.json().data.email);
				this.formGroup.controls['user_company_name'].setValue(res.json().data.company_name);
				this.formGroup.controls['phone'].setValue(res.json().data.phone);
				this.formGroup.controls['user_address'].setValue(res.json().data.address);
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

	edit_question(id){
		this.CreateForm(id);
	}


	delete_question(id){
		this.Loader = true;
		this.dashboardserve.delete_user_by_id(id).then((res) => {
			this.Loader = false;
			this.get_user();
			this.toastra.success(res.json().message);
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

	create_user(){
		let loginData = this.formGroup.value;
		let form = new FormData();
	   	// Object.keys(loginData).forEach(key => form.append(key, loginData[key]));
		   this.Loader = true;
		if(this.edituser == false){
			this.dashboardserve.create_user(this.formGroup.value).then((res) => {
				this.Loader = false;
				this.get_user();
				this.toastra.success(res.json().message);
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
		}else{

			

			this.dashboardserve.update_user(this.formGroup.value).then((res) => {
				this.Loader = false;
				this.get_user();
				this.create_contact = false;

				// this.toastra.success(res.json().message);
			}, error => {
				this.Loader = false;
				if (error.json().status_code == 400) {
					let get_err = error.json().message;
					// Object.keys(get_err).forEach(
					// 	key => this.toastra.error(get_err[key][0])
					// );
				} else{
					let get_err = error.json().message;
					// this.toastra.error(get_err);
				}
			});
			this.create_contact = false;

		}
	}

	
	search(event){
		let keyword = event.target.value;
		if(keyword == ""){
			this.get_user();
		}
		let formData = new FormData();
		this.Loader = true;
		 this.dashboardserve.search_user_list(keyword).then((res) => {
		   this.all_user = res.json().data;
		   this.edituser = false;
		   if(res.json().data.length == 0){
			   this.searchuser_list = false;
			}else{
			   this.searchuser_list = true;
		   }
		   this.get_user_by_id(res.json().data[0].id,null);   
		  this.Loader = false;

		 }, error => {
		  this.Loader = false;
		   this.toastra.error('error');
		 });
	 }
}
