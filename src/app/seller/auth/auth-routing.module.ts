import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { RegistrationComponent } from './registration/registration.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
  {path:'',redirectTo:'auth/login',pathMatch:'full'},
  { path: 'auth/login', component: LoginComponent },  
  { path: 'auth/register', component: RegistrationComponent },
  { path: 'verify-email', component: VerifyEmailComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAuthRoutingModule {}
