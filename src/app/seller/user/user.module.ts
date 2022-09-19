import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListComponent } from './list/list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewUserComponent } from './view-user/view-user.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal'; 
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUserComponent } from './create-user/create-user.component';



import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProductsModule } from '../products/products.module';
import { searchFilterUser } from 'src/app/services/pipe/searchFilterUser.pipe';



@NgModule({
  declarations: [
    ListComponent,
    ViewUserComponent,
    CreateUserComponent,
    searchFilterUser
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxPaginationModule,
    ModalModule.forRoot(),ReactiveFormsModule,
    ProductsModule,
    FormsModule,
    Ng2SearchPipeModule,
    
  
  ],
  providers: [BsModalService],
})
export class UserModule { }
