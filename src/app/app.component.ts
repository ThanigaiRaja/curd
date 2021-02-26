import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/service/login/login.service';

declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	constructor(private router: Router,private toastra:ToastrService,
		private loginserve: LoginService) {}

	title = 'Angular-FrontEnd';
	Loader:boolean;

	ngOnInit() {
		this.Loader=false; 
		if(sessionStorage.getItem('token')  === null){
			$(".top").css("display", "none");
			this.router.navigateByUrl('');
		}else{
			$(".top").css("display", "block");
			this.router.navigateByUrl('eventdashboard');
		}
	}


	logout(){
	
		this.loginserve.GoLogout().then((res)=>{
			$(".top").css("display", "none");
            sessionStorage.removeItem('token');
            this.router.navigateByUrl('');
        });  
    }

}
