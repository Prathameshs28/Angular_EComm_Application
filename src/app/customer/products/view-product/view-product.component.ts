import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swal from 'sweetalert2';
import { CartProducts } from '../../cart/modal/cart.modal';
import { addProductToCart, countIncr } from '../../cart/state/cart.actions';
import { getCartProd } from '../../cart/state/cart.selector';
import { CartState } from '../../cart/state/cart.state';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit {
  @ViewChild('widgetsContent') widgetsContent!: ElementRef;

  ProdID: any;
  oneProduct: any;

  imgClickIndex: any;
  imgClickFlag = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private http: HttpService,
    private router: Router,

    private store: Store<CartState>
  ) {}

  ngOnInit(): void {
    this.showStateData();

    this.activatedRoute.params.subscribe((params) => {
      this.ProdID = params['id'];
    });
    console.log(this.ProdID);

    this.http.get(`shop/products/${this.ProdID}`).subscribe({
      next: (res) => {
        this.oneProduct = res;

        this.oneProduct.qty = 1;

        // console.log('qty added: ',this.oneProduct);
      },
      error: (err: any) => {
        // this.error = err;
        console.log(err);
      },
    });
  }

  showBigImg(index: any) {
    console.log(index);
    this.imgClickFlag = true;
    this.imgClickIndex = index;
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }

  // --------------- add to cart & buy now -----------------------

  buyNowProdArray: any = [];

  buyNow() {
    this.buyNowProdArray.push(this.oneProduct);
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

  addToCart() {
    let products = this.makeProdObj(this.oneProduct);
    let productExists = false;

    if (this.cartAllData.length >= 1) {
      for (let i = 0; i < this.cartAllData.length; i++) {
        if (this.oneProduct._id == this.cartAllData[i]._id) {
          productExists = true;
          break;
        }
      }
    }

    if (productExists) {
      Swal.fire('Product already added to cart');
    } else {
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
}
