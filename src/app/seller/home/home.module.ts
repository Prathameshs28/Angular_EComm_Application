import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProductsModule } from '../products/products.module';
@NgModule({
  declarations: [
    ProfileComponent,    
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductsModule
  ]
})
export class HomeModule implements OnInit {
  ngOnInit(): void {
    // console.log('home module use')
  }
 }
