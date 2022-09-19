import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAuthGuard } from 'src/app/services/auth-guard/customer.auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import(`./products/products.module`).then((m) => m.ProductsModule),
  },
  {
    path: 'cart',
    loadChildren: () => import(`./cart/cart.module`).then((m) => m.CartModule),
   
  },
  {
    path: 'auth',
    loadChildren: () => import(`./auth/auth.module`).then((m) => m.AuthModule),
  },
  {
    path: 'self',
    loadChildren: () => import(`./self/self.module`).then((m) => m.SelfModule),
    canActivate:[CustomerAuthGuard] 
  },




];
 




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
