import { Component, OnInit } from '@angular/core';
import { Car } from './domain/car';
import { CarService } from './services/carservice';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';



export class PrimeCar implements Car {
    constructor(public vin?, public year?, public brand?, public color?) { }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [CarService]
})
export class AppComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showAccordian:boolean = false;

    constructor(private formBuilder: FormBuilder,
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
        } else if(this.loginForm.value.username=="admin" && this.loginForm.value.password=="admin") {
            console.log("Login Sucessful");
            this.showAccordian = true;
        }

        this.loading = true;
    }
}
