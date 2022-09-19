import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PageService } from 'src/app/services/table-service/page.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

  constructor(
    private http:HttpService,private router:Router,
    private pageService: PageService,
    private storageService:StorageService,
    private activatedRoute:ActivatedRoute

  ) { }

    oneOrder:any;

    orderID:any;
    prodcutData:any;
    addressData:any;
    orderData:any;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.orderID = params['id'];
      });
      // console.log(this.orderID);

      this.getOneOrder();
  }


  getOneOrder() {
    this.http.secureGet(`shop/orders/${ this.orderID}`,this.storageService.getCustomerToken())
    .subscribe({
      next:(data) =>{
        
        this.oneOrder = data;
        this.prodcutData =  this.oneOrder[0]?.items;
        this.addressData = this.oneOrder[0]?.address;
        this.orderData = this.oneOrder[0];
      //  console.log('product: ',  this.prodcutData)
        console.log( this.oneOrder[0]);
      },
      error:(err) =>{
        console.log(err);
      }
    })
}

// createdAt: "2022-08-24T09:50:01.143Z"   
// deliveryFee: 50 
// paymentStatus: "Pending"
// status: "Pending"
// total: 68509
// _id: "6305f4499c62bfabae65b2ea"



  goToAllOrders(){
      this.router.navigate(['self/orders'])
  }


  payAgain(orderID:any){
      this.storageService.setLoacalRepayOrderID(orderID);
      this.router.navigate(['cart/pay']);   

  }


}
