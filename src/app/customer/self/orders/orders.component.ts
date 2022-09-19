import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PageService } from 'src/app/services/table-service/page.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  constructor(
    private http:HttpService,private router:Router,
    private pageService: PageService,
    private storageService:StorageService, ) {}

    allData:any;
    allProducts:any;
    limit = 10;

  ngOnInit(): void {
    this.getAllOrders();
  }


  totalResult:any;

  getOrderLimit(){
    this.http.secureGet('shop/orders',this.storageService.getCustomerToken())
    .subscribe({
      next:(data) =>{
       
        this.totalResult= data;
        this.totalResult =  this.totalResult.totalResults;            
        
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }



  getAllOrders() {

        
    this.getOrderLimit();      
    
      setTimeout(() => {

      this.http.secureGet(`shop/orders?limit=${this.totalResult}`,this.storageService.getCustomerToken())
      .subscribe({  
        next:(data) =>{

          // console.log(data);

          this.allData = data;

          this.allProducts = this.allData.results;
          this.allProducts= this.allProducts.reverse();

          // console.log(this.allProducts);
        },
        error:(err) =>{
          console.log(err);
        }
      })

    }, 1000);
  }


  viewOrder(id:any){
      // console.log(id);

      this.router.navigate(['self/viewOrder',id])
  }
}
