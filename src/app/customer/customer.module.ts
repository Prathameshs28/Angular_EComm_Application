import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NgbModule,
    SharedModule
    
  ],
  exports:[SharedModule]
})
export class CustomerModule { }
