import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PageService } from 'src/app/services/table-service/page.service';
import { elementAt, last } from 'rxjs';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { CartState } from '../../cart/state/cart.state';
import { addProductToCart, countIncr } from '../../cart/state/cart.actions';
import { getCartProd } from '../../cart/state/cart.selector';
import { CartProducts } from '../../cart/modal/cart.modal';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  lowerHeader = false;

  constructor(
    private http: HttpService,
    private router: Router,
    private pageService: PageService,
    private storageService: StorageService,
    private store: Store<CartState>
  ) {}

  getAllProducts: any;

  products: any;
  cartData: any = [];

  oneProd: any; // one product to store local storage
  isProductInLocalStorage: any;

  pageNo: number = 1;
  totalPages: number = 0;
  pageLimit: number = 10;
  allItems: number = 0;

  cartItemCount = 0;

  ngOnInit(): void {
    
   this.showStateData();
    this.getProductList(10, 1);

    // if (this.storageService.checkCustomerLocalToken()) {
    //   this.lowerHeader = true;
    // }
  }

  getProductList(limit?: any, page?: any) {

    

    if (this.pageService.getViewFlag()) {
      this.pageNo = this.pageService.getPageNumber();
      this.pageLimit = this.pageService.getPageLimit();
    } else {
      this.pageNo = page;
      this.pageLimit = limit;
    }

    this.http
      .get(`shop/products`, `page=${this.pageNo}&&limit=${this.pageLimit}`)
      .subscribe({
        next: (data) => {
          this.getAllProducts = data;
          this.products = this.getAllProducts?.results;

          this.products.forEach((obj: any) => {
            obj.qty = 1;
          });

          // console.log('all products: ',this.products); // all product list

          this.totalPages = this.getAllProducts?.totalResults;

          this.allItems = this.getAllProducts?.totalResults; // for all items display

          // console.log('allItems: ',this.allItems);

          // console.log('all products details: ',this.getAllProducts)
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          // console.log('Get products process completed')
        },
      });
  }

  // ------ add to cart ---------------------

  cartAllData: any = [];

  showStateData() {
    // console.log(this.cartAllData);
    this.store.select(getCartProd).subscribe((data) => {
      let temp = JSON.parse(JSON.stringify(data));
      this.cartAllData = [...(temp || [])];
    });
  }
  
  makeProdObj(product: any) {
    const products: CartProducts = {
      price: product.price,
      _id: product._id,
      _org: {
        _id: product._org._id,
        name: product._org.name,
        email: product._org.email,
      },
      name: product.name,
      description: product.description,
      images: product.images,
      deleted: product.deleted,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      qty: product.qty,
    };

    return products;
  }

  addToCart(product: any) {
    // console.log('before adding cartAllData length', this.cartAllData.length);

   

    let products = this.makeProdObj(product);

    //  this.store.dispatch(addProductToCart({ products }));    // working

    let productExists = false;

    if (this.cartAllData.length >= 1) {
      for (let i = 0; i < this.cartAllData.length; i++) {
        if (product._id == this.cartAllData[i]._id) {
          productExists = true;
          break;
        }
      }
    }

    // else{
    //   console.log('1st else to add ');
    //   this.addNewProductToCart(products);

    //   }

    if (productExists) {
      Swal.fire('Product already added to cart');
    } else {
      // console.log('2nd else to add ');
      this.store.dispatch(countIncr());

      this.addNewProductToCart(products);
    }

    // localStorage.setItem('guard','checkoutflag');

  }

  addNewProductToCart(products: CartProducts) {
    this.store.dispatch(addProductToCart({ products }));
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Product added to cart',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // -------------- buy now -------------------

  buyNowProdArray: any = [];

  buyNow(product: any) {

    // console.log(product);
    this.buyNowProdArray.push(product);
    this.storageService.setBuyNowFlag(true);
    this.storageService.setBuyNowProductInLocal(this.buyNowProdArray);

    if (this.storageService.getCustomerToken()) {      
      this.router.navigate(['cart/checkout']);
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


  viewProduct(id: any) {
    // console.log('Mobile ID: ', id);
    this.pageService.setViewFlag(true);

    this.pageService.setPageNumber(this.pageNo);
    this.pageService.setPageLimit(this.pageLimit);

    this.router.navigate(['products/view', id]);
  }

  //----- Pagination-----

  pageChangeEvent(event: number) {
    // console.log('page no clicked: ', event);
    this.pageService.setViewFlag(false);
    this.pageNo = event;
    this.getProductList(this.pageLimit, this.pageNo);
  }

  onChangeSize(e: any) {
    console.log(e.target.value);
    this.pageLimit = e.target.value;

    this.pageNo = Math.round(this.allItems / this.pageLimit);
    console.log(this.pageNo);

    this.pageService.setPageNumber(this.pageNo);
    this.pageService.setPageLimit(this.pageLimit);

    this.getProductList(this.pageLimit, this.pageNo);
  }
}
