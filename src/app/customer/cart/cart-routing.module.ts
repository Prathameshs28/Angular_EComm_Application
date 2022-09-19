import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CartItemsComponent } from './cart-items/cart-items.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PayComponent } from './pay/pay.component';



const routes: Routes = [
  {path:'',redirectTo:'cart-items',pathMatch:'full'},
  { path: 'cart-items', component: CartItemsComponent },  
  { path: 'checkout', component: CheckoutComponent },  
  { path: 'pay', component: PayComponent},  
  
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
