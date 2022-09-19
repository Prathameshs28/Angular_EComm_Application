import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swal from 'sweetalert2';
import {
  countDecr,
  countReset,
  deleteProduct,
  incrementProductItem,
  resetState,
} from '../state/cart.actions';
import { getCartProd } from '../state/cart.selector';
import { CartState } from '../state/cart.state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private http: HttpService,
    private toastr: ToastrService,
    private store: Store<CartState>
  ) {}
  localCartData!: any;
  flag = false;
  cartTotal = 0;
  addressForm!: FormGroup;
  sumitted = false;
  error:any;
  deliveryFee = 50; // fixed delivery fee above 1000 rs

  ngOnInit(): void {
    // this.getLocalData();

    if (this.storageService.hascheckOutPermission() == false) {
      this.router.navigate(['cart/cart-items']);
    }

    this.getBuyNowFlag();

    if (this.buyNowFlag) {
      this.getBuyNowProduct();
    } else {
      this.getLocalData(); // ngrx call
    }

    this.loadAllAddress();
    this.addAddress();
  }

  //------------------buy now ---------------

  buyNowFlag = false;

  getBuyNowFlag() {
    this.buyNowFlag = this.storageService.getBuyNowFlag();
    console.log('buynow flag: ',this.buyNowFlag);
  }

  getBuyNowProduct() {
    this.localCartData = this.storageService.getBuyNowProductInLocal();
    this.localCartData = JSON.parse(this.localCartData);
    this.cartTotal = this.localCartData[0].price * this.localCartData[0].qty;
    // console.log('buy now product',this.localCartData);
  }

  // ---------- ngrx- get product list  ---------------

  getLocalData() {
    // using ngrx
    this.cartTotal = 0;
    this.store.select(getCartProd).subscribe((data) => {
      let temp = JSON.parse(JSON.stringify(data));
      this.localCartData = temp;

      // console.log('ngrx called');

      // this.flag = true;

      for (let i = 0; i < this.localCartData.length; i++) {
        this.cartTotal +=
          this.localCartData[i].price * this.localCartData[i].qty;
      }

      // console.log('ngrx cart data',this.localCartData);
    });

    // console.log(this.flag)
  }

  //--------------- remove cart using ngrx -----------------------

  removeFromCart(id: any) {
    // console.log(this.localCartData.length);

    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
        this.store.dispatch(deleteProduct({ id }));
        this.store.dispatch(countDecr());
      }
    }

    if (this.localCartData.length == 0) {
      this.store.dispatch(countReset());
      localStorage.removeItem('cartState');
      this.store.dispatch(resetState());

      setTimeout(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'All products removed',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['products/list']);
      }, 1000);
    }

    this.getLocalData();
  }

  sweetAlertForDelete(id: any) {
    if (this.buyNowFlag) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('BuyNowProd');
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          this.router.navigate(['']);
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeFromCart(id);
          // console.log(id);
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        }
      });
    }
  }

  // -------------- product item increment and decrement --------------------

  decrementCount(id: any) {
    if (this.buyNowFlag) {
      this.localCartData = this.storageService.getBuyNowProductInLocal();
      this.localCartData = JSON.parse(this.localCartData);
      if (this.localCartData[0]['qty'] > 1) {
        this.localCartData[0]['qty'] -= 1;
        this.toastr.success('', 'Product count decremented');
      } else {
        Swal.fire(`Atleast one unit required`);
      }
      // console.log(this.localCartData[0]['qty']);
      this.storageService.setBuyNowProductInLocal(this.localCartData);

      this.getBuyNowProduct();
    } else {
      // console.log(id);
      for (let i = 0; i < this.localCartData.length; i++) {
        if (this.localCartData[i]._id == id) {
          // console.log('id found',this.localCartData[i]);

          // let product = this.localCartData[i];
          // let products = this.makeProduct(product);

          let products = this.localCartData[i];

          if (products['qty'] > 1) {
            products['qty'] -= 1;
            this.toastr.success('', 'Product count decremented');
          } else {
            Swal.fire(`Atleast one unit required`);
          }

          this.store.dispatch(incrementProductItem({ products }));
        }
      }
      this.getLocalData();
    }
  }

  incrementCount(id: any) {
    // console.log(id);

    // console.log(this.localCartData.length);
    if (this.buyNowFlag) {
      this.localCartData = this.storageService.getBuyNowProductInLocal();
      this.localCartData = JSON.parse(this.localCartData);
      if (this.localCartData[0]['qty'] < 10) {
        this.localCartData[0]['qty'] += 1;
        this.toastr.success('', 'Product count incremented');
      } else {
        Swal.fire(`We're sorry! Only 10 unit(s) allowed in each order`);
      }

      // console.log(this.localCartData[0]['qty']);
      this.storageService.setBuyNowProductInLocal(this.localCartData);

      this.getBuyNowProduct();
    } else {
      for (let i = 0; i < this.localCartData.length; i++) {
        if (this.localCartData[i]._id == id) {
          // console.log('id found',this.localCartData[i]);

          // let product = this.localCartData[i];

          // let products = this.makeProduct(product);

          let products = this.localCartData[i];

          if (products['qty'] < 10) {
            products['qty'] += 1;
            this.toastr.success('', 'Product count incremented');
          } else {
            Swal.fire(`We're sorry! Only 10 unit(s) allowed in each order`);
          }

          this.store.dispatch(incrementProductItem({ products }));
        }
      }

      this.getLocalData();
    }
  }

  //---------------------- Without Ngrx --------------------------

  // getLocalData() {                      // without ngrx
  //   this.cartTotal = 0;
  //   if (this.storageService.checkCartItemsInLocal()) {
  //     this.localCartData = this.storageService.getLocalCart();

  //     this.localCartData = JSON.parse(this.localCartData);

  //     this.flag = true;

  //     for (let i = 0; i < this.localCartData.length; i++) {
  //       this.cartTotal +=
  //         this.localCartData[i].price * this.localCartData[i].qty;
  //     }

  //     // console.log(this.localCartData);
  //   } else {
  //     this.flag = false;

  //     console.log('called');
  //   }
  // }

  // ---------------- remove item without ngrx ------------------

  // removeFromCart(id: any) {
  //   // console.log(this.localCartData.length);

  //   for (let i = 0; i < this.localCartData.length; i++) {
  //     if (this.localCartData[i]._id == id) {
  //       this.localCartData.splice(i, 1);
  //     }
  //   }

  //   if (this.localCartData.length == 0) {
  //     localStorage.removeItem('CartData');

  //     setTimeout(() => {
  //       Swal.fire({
  //         position: 'top-end',
  //         icon: 'success',
  //         title: 'All products removed',
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       this.router.navigate(['products/list']);
  //     }, 1000);
  //   } else {
  //     this.storageService.setLocalCart(this.localCartData);
  //   }

  //   this.getLocalData();
  // }

  // sweetAlertForDelete(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.removeFromCart(id);

  //       console.log(id);
  //       Swal.fire('Deleted!', 'Product has been deleted.', 'success');
  //     }
  //   });
  // }

  // ------------------ get all addresses----------------
  allAddresses?: any;

  defaultAddress?: any;

  loadAllAddress() {
    this.http
      .secureGet('customers/address', this.storageService.getCustomerToken())
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.allAddresses = res;
          this.defaultAddress = this.allAddresses?.[0];
          // console.log(this.allAddresses);
          // console.log(this.allAddresses);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          // console.log('all address loaded');
        },
      });
  }

  // ---------- add new address ----------------

  get street() {
    return this.addressForm.get('street');
  }

  get addressLine2() {
    return this.addressForm.get('addressLine2');
  }
  get city() {
    return this.addressForm.get('city');
  }
  get state() {
    return this.addressForm.get('state');
  }

  get pin() {
    return this.addressForm.get('pin');
  }

  addAddress() {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pin: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
    });
  }

  addNewAddress() {
    this.sumitted = true;
    // console.log(this.addressForm.value.addresses[0])
    if (this.addressForm.valid) {
      this.http
        .securePost(
          'customers/address',
          this.storageService.getCustomerToken(),
          this.addressForm.value
        )
        .subscribe({
          next: (res) => {
            // console.log(res);
            this.loadAllAddress();
            this.addressForm.reset();
            this.sumitted = false;
            this.toastr.success('New address added successfully!!');
            // console.log(this.addressForm.value);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            // console.log('new address added');
            this.addressForm.reset();
          },
        });
    }
  }

  selectedAddress(id: any) {
    // console.log(id);

    for (let i = 0; i < this.allAddresses.length; i++) {
      if (this.allAddresses[i]._id == id) {
        this.defaultAddress = this.allAddresses[i];
      }
    }
    this.toastr.success('', 'Address selected!!!');
  }

  updateID: any;
  editAddress(index: any, id: any) {
    // console.log(index);
    this.updateID = id;

    this.addressForm.patchValue({
      street: this.allAddresses[index].street,
      addressLine2: this.allAddresses[index].addressLine2,
      city: this.allAddresses[index].city,
      state: this.allAddresses[index].state,
      pin: this.allAddresses[index].pin,
    });
  }

  updateCustAddress() {
    this.http
      .securePut(
        `customers/address/${this.updateID}`,
        this.storageService.getCustomerToken(),
        this.addressForm.value
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.loadAllAddress();
          this.toastr.success('', 'Address Successfully Updated');
          this.addressForm.reset();

          this.sumitted = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  resetForm() {
    this.addressForm.reset();
  }

  close() {
    this.addressForm.reset();
    this.sumitted = false;
  }

  // --------- order confimration -----------------

  // this.defaultAddress
  // this.localCartData

  productListOrder: any = [];
  addressForOder: any;
  orderID: any;
  createOrderProducts() {
    // console.log('products data created',this.localCartData)

    for (let i = 0; i < this.localCartData.length; i++) {
      // console.log(this.localCartData[i]);

      let obj = {
        productId: this.localCartData[i]._id,
        name: this.localCartData[i].name,
        price: this.localCartData[i].price,
        qty: this.localCartData[i].qty,
        subTotal: this.localCartData[i].price * this.localCartData[i].qty,
      };

      // console.log("obj: ",obj);

      this.productListOrder.push(obj);
    }
  }

  createOrderAddress() {
    // console.log('order address: ',this.defaultAddress);

    this.addressForOder = {
      street: this.defaultAddress.street,
      addressLine2: this.defaultAddress.addressLine2,
      city: this.defaultAddress.city,
      state: this.defaultAddress.state,
      pin: this.defaultAddress.pin,
    };

    // console.log(this.addressForOder)
  }

  confirmOrderSweetAlert() {
    Swal.fire({
      title: 'Please confirm order and make payment',
      text: 'You will redirect to payment page after confirmation',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmOrder();
      }
    });
  }

  confirmOrder() {
    // console.log('order address: ',this.defaultAddress);
    // console.log('order data: ',this.localCartData);

    if (this.cartTotal < 1000) {
      this.cartTotal += this.deliveryFee;
    } else {
      this.deliveryFee = 0;
    }
    const OrderData = {
      items: this.productListOrder,
      deliveryFee: this.deliveryFee,
      total: this.cartTotal,
      address: this.addressForOder,
    };

    // console.log(OrderData);

    this.http
      .securePost(
        'shop/orders',
        this.storageService.getCustomerToken(),
        OrderData
      )

      .subscribe({
        next: (data: any) => {
          console.log(data);
          let orderID = data.order._id;

          // console.log('Order ID',orderID);
          this.toastr.success('', 'Your order confirmed!!!');
          // localStorage.removeItem('CartData');
          if (this.buyNowFlag) {
            localStorage.removeItem('BuyNowProd');
          } else {
            localStorage.removeItem('cartState');
            this.store.dispatch(resetState());
          }

          setTimeout(() => {
            this.storageService.setLoacalRepayOrderID(orderID);
            this.router.navigate(['cart/pay']);
          }, 2000);
        },
        error: (err: any) => {
          // this.error = err.error.message;
          this.error = err;
          console.log(err);
        },
      });
  }
}
