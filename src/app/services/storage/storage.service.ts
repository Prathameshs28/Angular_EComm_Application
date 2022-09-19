import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getCartProd } from 'src/app/customer/cart/state/cart.selector';
import { CartState } from 'src/app/customer/cart/state/cart.state';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  static hascheckOutPermission() {
    throw new Error('Method not implemented.');
  }
  constructor(private router: Router, private http: HttpClient,private store: Store<CartState>,) {

    this.userName= localStorage.getItem('userName');
    if(this.userName){
      let name =  this.userName.split(" ");
      this.userName = name[0];
    }
  }




  userName!:string | null; 
  
   //------------------- seller --------------------------

  oldToken = '';

  setLocal(data: any) {
    localStorage.setItem('UserData', JSON.stringify(data));
  }

  getLocal() {
    return localStorage.getItem('UserData');
  }

  getToken() {
    let data: any = this.getLocal();
    data = JSON.parse(data);

    return data.token;
  }

  checkLocalToken() {
    return !!localStorage.getItem('UserData');
  }

  setOldToken(t: any) {
    this.oldToken = t;
  }

  getOldToken() {
    return this.oldToken;
  }



  

   // --------------- cutomer Customer local storage ----------------------------

  // --------------  cart without ngrxs ---------------------------------------

  // setLocalCart(data: any) {
  //   localStorage.setItem('CartData', JSON.stringify(data));
  // }

  // getLocalCart() {
  //   return localStorage.getItem('CartData');
  // }

  // checkCartItemsInLocal() {
  //   return !!localStorage.getItem('CartData');
  // }

  // cartItems: number = 0;

  //--------------------------------------------------------------

  // Customer local storage

  setCustomerLocal(data: any) {
    localStorage.setItem('CustomerData', JSON.stringify(data));
  }

  getCustomerLocal() {
    return localStorage.getItem('CustomerData');
  }

  getCustomerToken() {
    let data: any = this.getCustomerLocal();
    data = JSON.parse(data);
    return data?.token;
  }

  checkCustomerLocalToken() {
    return !!localStorage.getItem('CustomerData');
  }

  // ------------ repay ----------------------

  setLoacalRepayOrderID(orderID: any) {
    localStorage.setItem('ORDERID', orderID);
  }

  getLoacalRepayOrderID() {
    return localStorage.getItem('ORDERID');
  }

  checkCustomerRepayOrderID() {
    return !!localStorage.getItem('ORDERID');
  }



  //---------- buy now --------------

  buyNowFlag = false;

  setBuyNowProductInLocal(product:any){
    localStorage.setItem('BuyNowProd', JSON.stringify(product));
  }

  
  getBuyNowProductInLocal(){
   return localStorage.getItem('BuyNowProd');  
  }

  setBuyNowFlag(flag:boolean){
    this.buyNowFlag = flag;
  }

  getBuyNowFlag(){
    return this.buyNowFlag;
  }

//--------- check cart state in local ----------


  localdata:any;
  getCartState() {
    this.store.select(getCartProd).subscribe((data) => {
     this.localdata= JSON.parse(JSON.stringify(data));  
     
    });
  return  this.localdata.length != 0 ? true:false;
  
  }


//-------- routing condition for customer -----------


hasPermission(){
 return this.getCustomerToken();
}


hascheckOutPermission(){
  return (this.checkCustomerLocalToken() && (this.getCartState() || this.getBuyNowFlag()));
}


hasPayPermission(){
  let doCheck = this.checkCustomerLocalToken()  && this.checkCustomerRepayOrderID();
 
  return doCheck;
 }


}
