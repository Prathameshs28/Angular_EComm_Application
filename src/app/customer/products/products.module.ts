import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './list/list.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { ViewProductComponent } from './view-product/view-product.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../shared/shared.module';
import {NgDompurifyModule} from '@tinkoff/ng-dompurify';

@NgModule({
  declarations: [
    
    ListComponent,
    ViewProductComponent,
    
        
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbModule,
    
    NgxPaginationModule,
    SharedModule,
    NgDompurifyModule
    
  ],
  exports:[]

})
export class ProductsModule { }
