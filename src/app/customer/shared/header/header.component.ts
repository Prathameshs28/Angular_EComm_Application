
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
// import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { getCartProd, getCounter } from '../../cart/state/cart.selector';
import { CartState } from '../../cart/state/cart.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    public storageService:StorageService,
    private toastr: ToastrService,
    private store: Store<CartState>,
 
  ) {}

  counter!:number;

  counter$!: Observable<{ counter: number }>;

  loginFlag = false;
  logOutFlag = false;

  userName!:any;



  ngOnInit() {


      if(this.storageService.checkCustomerLocalToken()){
        this.loginFlag = true;     

        
          this.userName = this.storageService.userName;  

      }else{
        this.logOutFlag = true;
      }


      

        this.store.select(getCounter).subscribe((counter)=>{
          // console.log('counter is called',counter) ;
          this.counter = counter;
          })
    

  }



  productList() {
    this.storageService.setBuyNowFlag(false);   
    localStorage.removeItem('BuyNowProd');
    this.router.navigate(['products/list']);
  }

  login() {
    this.router.navigate(['auth/login']);
  }

  showCart() {
    
    this.storageService.setBuyNowFlag(false);   
    localStorage.removeItem('BuyNowProd');
    this.router.navigate(['cart']); 
  }

  toProfile(){
    this.storageService.setBuyNowFlag(false);   
    localStorage.removeItem('BuyNowProd');
    this.router.navigate(['self/profile']);
  }

  logout() {
    if(this.storageService.checkCustomerLocalToken()){
     

      let keysToRemove = ['ORDERID', 'BuyNowProd','userName','CustomerData']; //cartState

        for (let i of keysToRemove) {
            localStorage.removeItem(i);
        }

  
      this.toastr.success('Successfully logged-out');
      this.router.navigate(['auth/login']);
  }

}



}
