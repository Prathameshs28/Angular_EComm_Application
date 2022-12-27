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
   

    this.getCartProducts();
  }

  // ------ ngrx get products from state -------------

  getCartProducts() {
    this.store.select(getCartProd).subscribe((data) => {
      let temp = JSON.parse(JSON.stringify(data));
      this.localCartData = temp;

      
    });

    if (this.localCartData.length != 0) {
      this.flag = true;
    } else {
      this.flag = false;
    }

   
  }

  clearCart() {
   

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



          this.store.dispatch(resetState()); 
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
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      }
    });
  }

  // -------------- product item increment and decrement --------------------

  decrementCount(id: any) {
  
    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
        

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
   

    for (let i = 0; i < this.localCartData.length; i++) {
      if (this.localCartData[i]._id == id) {
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

   

  // ---------------- checkout with ngrx ----------------

  checkout() {
   
     

     
        if (this.storageService.getCustomerToken()) {
      
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
  // ----------- view profile ------------------------------

  viewProduct(id: any) {
    this.router.navigate(['products/view', id]);
  }
}
