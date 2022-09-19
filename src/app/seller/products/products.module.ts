import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { HeaderComponent } from './header/header.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateProductComponent } from './create-product/create-product.component';
import { HttpClientModule } from '@angular/common/http';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { searchFilter } from '../../services/pipe/searchFilter.pipe';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxEditorModule } from 'ngx-editor';
import {NgDompurifyModule} from '@tinkoff/ng-dompurify';
@NgModule({
  declarations: [
    ProductListComponent,
    HeaderComponent,
    ViewProductComponent,
    CreateProductComponent,   
    searchFilter
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgxDropzoneModule,
    NgxEditorModule,
    NgDompurifyModule
    
  ],
  exports:[HeaderComponent],
  bootstrap: [ProductListComponent]
  
})
export class ProductsModule { }
