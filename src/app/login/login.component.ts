import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted;
  myForm: FormGroup;
  error: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth:AuthService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.email]],
        pwd: ['', [Validators.required, Validators.minLength(6)]],
      }
    );
  }
  _formSubmit() {


    this.submitted = true;
    let user=this.myForm.value
    if (this.myForm.invalid) {
      return;
    }
    else {
        this.auth.login(user).
        then(res => { 
          console.log("Login done");
          this.router.navigate(['/welcome'])
        }, err => {
          console.log("not done");
          this.error=true;
        });
    }
  }

  signInWithGoogle(){
    this.auth.doGoogleLogin().
    then(res => { 
      console.log("Login done");
      this.router.navigate(['/welcome'])
    }, err => {
      console.log("not done");
      this.error=true;
    });
  }

  signInWithFacebook(){
    this.auth.doFacebookLogin().
    then(res => { 
      console.log("Login done");
      this.router.navigate(['/welcome'])
    }, err => {
      console.log("not done");
      this.error=true;
    });
  }
}
