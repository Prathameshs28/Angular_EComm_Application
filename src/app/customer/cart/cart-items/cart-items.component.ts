import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/services/storage/storage.service';
import Swal from 'sweetalert2';
import { CartProducts } from '../modal/cart.modal';
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
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private store: Store<CartState>,
    private toastr: ToastrService
  ) {}

  localCartData: any;
  flag = false;

  ngOnInit(): void {
    // this.getLocalData();    // without ngrx

    this.getCartProducts(); // using ngrx
  }

  // ------ ngrx get products from state -------------

  getCartProducts() {
    this.store.select(getCartProd).subscribe((data) => {
      let temp = JSON.parse(JSON.stringify(data));
      this.localCartData = temp;

      // console.log('ngrx cart data',this.localCartData);
    });

    if (this.localCartData.length != 0) {
      this.flag = true;
    } else {
      this.flag = false;
    }

    // console.log(this.flag)
  }

  clearCart() {
    // console.log(this.localCartData);

    if (this.localCartData.length == 0) {
      Swal.fire('Cart is empty');
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.flag = false;



          this.store.dispatch(resetState()); // when reset cart state will be reset
          this.store.dispatch(countReset());
          localStorage.removeItem('cartState');

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cart is empty',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }

  // ----------------- delete product: ngrx -------------------

  removeFromCart(id: any) {
    // console.log(this.localCartData.length);

    // this.storageService.cartItems -= 1;

    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
        this.store.dispatch(deleteProduct({ id }));
        this.store.dispatch(countDecr());
      }
    }

    // this.store.dispatch(deleteProduct({id}));

    if (this.localCartData.length == 0) {
      
      this.store.dispatch(countReset());
      localStorage.removeItem('cartState');
      this.store.dispatch(resetState());
    }
    this.getCartProducts();
  }

  sweetAlertForDelete(id: any) {
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

  // -------------- product item increment and decrement --------------------

  decrementCount(id: any) {
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

    this.getCartProducts();
  }

  incrementCount(id: any) {
    // console.log(id);

    // console.log(this.localCartData.length);

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

    this.getCartProducts();
  }

  // makeProduct(product: CartProducts) {
  //   const products: CartProducts = {
  //     price: product.price,
  //     _id: product._id,
  //     _org: {
  //       _id: product._org._id,
  //       name: product._org.name,
  //       email: product._org.email,
  //     },
  //     name: product.name,
  //     description: product.description,
  //     images: product.images,
  //     deleted: product.deleted,
  //     createdAt: product.createdAt,
  //     updatedAt: product.updatedAt,
  //     qty: product.qty,
  //   };

  //   return products;
  // }
  

  // ---------------- checkout with ngrx ----------------

  checkout() {
   
      // let buyNowFlag = this.storageService.getBuyNowFlag();

     
        if (this.storageService.getCustomerToken()) {
          // console.log(this.localCartData);
          if ( this.localCartData.length !=0) {
            this.router.navigate(['cart/checkout']);
          } else {
            Swal.fire('Cart is empty!!!');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Login please!',
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(() => {
                this.router.navigate(['auth/login']);
              }, 1000);
            }
          });
        }
      

    
  }

  // ---------------------------------------------------------------------------
  //---------------------  without ngrx  ---------------------------------------
  // ---------------------------------------------------------------------------

  // getLocalData() {
  //   // without ngrx
  //   if (this.storageService.checkCartItemsInLocal()) {
  //     this.localCartData = this.storageService.getLocalCart();

  //     this.localCartData = JSON.parse(this.localCartData);

  //     this.flag = true;

  //     // console.log(this.localCartData);
  //   } else {
  //     this.flag = false;

  //     console.log('called');
  //   }
  // }

  // clearCart() {
  //   this.storageService.cartItems = 0;
  //   if (!this.storageService.checkCartItemsInLocal()) {
  //     Swal.fire('Cart is empty');
  //   } else {
  //     this.flag = false;
  //     localStorage.removeItem('CartData');

  //     Swal.fire({
  //       position: 'top-end',
  //       icon: 'success',
  //       title: 'Cart is empty',
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   }
  // }

  // checkout() {
  //   if (this.storageService.getCustomerToken()) {
  //     if (this.storageService.getLocalCart()) {
  //       this.router.navigate(['cart/checkout']);
  //     } else {
  //       Swal.fire('Cart is empty!!!');
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Login please!',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         setTimeout(() => {
  //           this.router.navigate(['auth/login']);
  //         }, 1000);
  //       }
  //     });
  //   }
  // }

  /*   removeFromCart(id: any) {
    // console.log(this.localCartData.length);

    this.storageService.cartItems -= 1;

    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
        this.localCartData.splice(i, 1);
      }
    }

    if (this.localCartData.length == 0) {
      localStorage.removeItem('CartData');
    } else {
      this.storageService.setLocalCart(this.localCartData);
    }

    this.getLocalData();
  }

  sweetAlertForDelete(id: any) {
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
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      }
    });
  } */

  /*  decrementCount(id: any) {
    // console.log(id,index);

    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
        this.localCartData[i].qty -= 1;
      }
    }
    this.storageService.setLocalCart(this.localCartData);

    this.getLocalData();
  }

  incrementCount(id: any) {
    // console.log(this.localCartData.length);

    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
        this.localCartData[i].qty += 1;
      }
    }
    this.storageService.setLocalCart(this.localCartData);

    this.getLocalData();
  }
 */

  // ----------- view profile ------------------------------

  viewProduct(id: any) {
    this.router.navigate(['products/view', id]);
  }
}
