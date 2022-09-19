import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../../services/auth-guard/auth.guard';
import { CreateProductComponent } from './create-product/create-product.component';

import { ProductListComponent } from './product-list/product-list.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [

  {path:'',redirectTo:'list',pathMatch:'full'},
  {path: 'list', component: ProductListComponent},
  {path: 'view/:id', component: ViewProductComponent},
  {path:'create',component:CreateProductComponent} 

 
];

@NgModule({
 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
