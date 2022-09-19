import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ViewProductComponent} from './view-product/view-product.component'




const routes: Routes = [
  {path:'',redirectTo:'products/list',pathMatch:'full'},
  { path: 'products/list', component: ListComponent },   
  { path: 'products/view/:id', component: ViewProductComponent }  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
