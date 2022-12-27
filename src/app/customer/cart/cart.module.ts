import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';


import {NgStepperModule} from 'angular-ng-stepper';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StoreModule } from '@ngrx/store';
import { cartReducer } from './state/cart.reducer';

import { ADD_TO_CART } from './state/cart.selector';
import { PayComponent } from './pay/pay.component';


@NgModule({
  declarations: [CartItemsComponent, CheckoutComponent, PayComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgStepperModule,CdkStepperModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    CdkStepperModule,
    StoreModule.forFeature(ADD_TO_CART,cartReducer)

  ],
})
export class CartModule {}
