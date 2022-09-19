import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressesComponent } from './addresses/addresses.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  {path:'',redirectTo:'profile',pathMatch:'full'},
  { path: 'profile', component: ProfileComponent },
  { path: 'addresses', component: AddressesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'viewOrder/:id', component: ViewOrderComponent },

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfRoutingModule { }
