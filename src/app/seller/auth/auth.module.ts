import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

import {  RecaptchaV3Module } from "ng-recaptcha";

import { RecaptchaModule } from "ng-recaptcha";


@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    UserAuthRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
    RecaptchaV3Module,
    RecaptchaModule

  ]
})
export class AuthModule implements OnInit{ 
  ngOnInit(): void {
  
  }
}
