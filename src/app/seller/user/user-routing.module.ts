import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListComponent } from './list/list.component';
import { ViewUserComponent } from './view-user/view-user.component';

const routes: Routes = [
  {path:'',redirectTo:'list',pathMatch:'full'},  
  { path: 'list', component: ListComponent },
  {path:'view/:id',component:ViewUserComponent},
  {path:'create',component:CreateUserComponent} 
   ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
