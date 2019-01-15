import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SharedService } from "./shared.service";




@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showAccordian:boolean = false;

    role:any;

    constructor(private formBuilder: FormBuilder,
        private sharedService:SharedService,
        private router: Router) { }

    get f() { return this.loginForm.controls; }

    ngOnInit() {
        this.showAccordian = false;
        this.loginForm = this.formBuilder.group({
            username: ['admin', Validators.required],
            password: ['admin', Validators.required]
        });

    }
    onSubmit() {
        this.submitted = true;

        console.log(this.loginForm);

        if (this.loginForm.invalid) {
            return;
        } else {
            this.sharedService.post('/loginForAdminPanel',{
                "username": this.loginForm.value.username, 
                "password": this.loginForm.value.password,
            }).subscribe((d:any)=>{
                console.log(d);
                if (d.ResponseString == 1) {
                    console.log("User Logged in Sucessfully");
                    sessionStorage.setItem("userDetails",JSON.stringify(d.ResponseObject[0]));
                    this.role = d.ResponseObject[0].role;
                    this.showAccordian = true;
                } else {
                    alert("Kindly Check your Credentials");
                }
            })
        }
        // if(this.loginForm.value.username=="admin" && this.loginForm.value.password=="admin") {
        //     console.log("Login Sucessful");
        //     this.showAccordian = true;
        // }

        this.loading = true;
    }
}
