import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/auth-guard/auth.guard';

const routes: Routes = [

   {
    path: '',
    loadChildren: () =>
      import(`./auth/auth.module`).then((m) => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import(`./home/home.module`).then((m) => m.HomeModule),
       canActivate:[AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () =>
      import(`./user/user.module`).then((m) => m.UserModule),
      canActivate:[AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () =>
      import(`./products/products.module`).then((m) => m.ProductsModule),
      canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
