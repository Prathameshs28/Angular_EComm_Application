import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfRoutingModule } from './self-routing.module';
import { ProfileComponent } from './profile/profile.component';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { AddressesComponent } from './addresses/addresses.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { OrdersComponent } from './orders/orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';


@NgModule({
  declarations: [
    ProfileComponent,
    AddressesComponent,
    OrdersComponent,
    ViewOrderComponent,
    
  ],
  imports: [
    CommonModule,
    SelfRoutingModule,
    SharedModule,
    AvatarModule,
    FormsModule, ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class SelfModule { }
