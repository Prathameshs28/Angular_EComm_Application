import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
    {
    path: '',
    loadChildren: () =>
      import(`./customer/customer.module`).then((m) => m.CustomerModule),
  },
  {
    path: 'seller',
    loadChildren: () =>
      import(`./seller/seller.module`).then((m) => m.SellerModule),
      
  },
  { path: '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
