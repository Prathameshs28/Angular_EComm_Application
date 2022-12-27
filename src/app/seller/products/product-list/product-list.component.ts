import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PageService } from 'src/app/services/table-service/page.service';
import Swal from 'sweetalert2';
import { schema, toHTML,toDoc, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  allData: any;
  productListData: any;
  displayStyle: any;
  sumitted = false;
  productUpdateForm!: FormGroup;
  updateID: any;

  publicIdArr: any = [];

  getProdName: any;
  getProdDesc: any;
  getData: any;

  images!: any;
  blurImg = false;
  flag = false;
  updateImgForm!: FormGroup;

  pageNo: number = 1;
  totalPages: number = 0;
  pageLimit: number = 10;
  allItems: number = 0;

  imageUrl: any = [];
  targetImages: any;

  searchTerm = '';
  searchAllData!: any;

  files: File[] = [];

  htmlDesc!:any;

  editor!: Editor;


  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private router: Router,
    private http: HttpService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.getProductList(10, 1);

    this.productUpdateForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),

    });

    this.updateImgForm = this.fb.group({
      photo: new FormControl(''),
    });
  }

  get f() {
    return this.productUpdateForm.controls;
  }

  get photo() {
    return this.updateImgForm.controls;
  }

  getProductList(limit?: any, page?: any) {
    if (this.pageService.getViewFlag()) {
      this.pageNo = this.pageService.getPageNumber();
      this.pageLimit = this.pageService.getPageLimit();
    } else {
      this.pageNo = page;
      this.pageLimit = limit;
    }

    console.log('getprod fun: pno ', this.pageNo);
    console.log('getprod fun:plimit ', this.pageLimit);

    this.http
      .secureGet(
        `products?page=${this.pageNo}&&limit=${this.pageLimit}`,
        this.storageService.getToken()
      )
      .subscribe({
        next: (res) => {
          this.allData = res;

          this.productListData = this.allData?.results; 
          this.searchAllData = this.productListData; 
          this.totalPages = this.allData?.totalResults;

          this.allItems = this.allData?.totalResults; 

          console.log(this.productListData);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  viewProduct(id: any) {
    this.pageService.setViewFlag(true);

    this.pageService.setPageNumber(this.pageNo);
    this.pageService.setPageLimit(this.pageLimit);

    this.router.navigate(['seller/products/view', id]);
  }

  deleteProduct(id: any) {
    // console.log(id);
    this.http
      .secureDelete(`products/${id}`, this.storageService.getToken())
      .subscribe({
        next: (res) => {
          this.toastr.success('', 'Product Deleted');
          this.getProductList(this.pageLimit, this.pageNo);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
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
        this.deleteProduct(id);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  createNewProduct() {
    this.router.navigate(['seller/products/create']);
  }

  // Update Product model

  openUpdatePopup(id: any) {
    this.updateID = id;
    this.displayStyle = 'block';

    this.http
      .secureGet(`products/${this.updateID}`, this.storageService.getToken())
      .subscribe({
        next: (res) => {
          this.getData = res;
          this.images = this.getData.images;

          this.productUpdateForm.setValue({
            name: this.getData.name,
            description: this.getData.description,
            price: this.getData.price,

          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  closePopup() {
    this.files = [];
    this.displayStyle = 'none';
  }

  updateProduct() {
    this.sumitted = true;
    if (this.productUpdateForm.valid) {
      this.http
        .securePatch(
          `products/${this.updateID}`,
          this.storageService.getToken(),
          this.productUpdateForm.value
        )
        .subscribe({
          next: (res) => {
            this.updateProductImage();
            this.toastr.success('', 'Product details updated!');
            this.getProductList(this.pageLimit, this.pageNo);
            this.closePopup();
          },
          error: (err: any) => {

            console.log(err);
          },
        });
    }
  }

  close() {
    this.imageUrl = [];
    this.publicIdArr = [];
   
    this.closePopup();
  }


  deleteImg(publicID: any) {
    console.log(publicID);
    if (this.publicIdArr.includes(publicID)) {
      let index = this.publicIdArr.indexOf(publicID);
      this.publicIdArr.splice(index, 1);
    } else {
      this.publicIdArr.push(publicID);
    }
  }

  makeBlur(publicID: any) {
    return this.publicIdArr.includes(publicID) ? true : false;
  }

  iconColor(publicID: any) {
    return this.publicIdArr.includes(publicID) ? true : false;
  }

  // ----------------------------------------------------------------

  updateProductImage() {
   

    const fd = new FormData();
    for (let i = 0; i < this.updateImgForm.value.photo?.length; i++) {
      fd.append('new_images', this.updateImgForm.value.photo[i]);
    }

    if (this.publicIdArr) {
      for (let i = 0; i < this.publicIdArr.length; i++) {
        fd.append('delete', this.publicIdArr[i]);
      }
    }

    this.http
      .secureProdPatch(
        `products/images/${this.updateID}`,
        this.storageService.getToken(),
        fd
      )
      .subscribe({
        next: (data: any) => {
          this.getProductList(this.pageLimit, this.pageNo);
          this.images = data.images;
          this.imageUrl = [];
          this.targetImages = '';
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onSelectFile(e: any) {

    this.files.push(...e.addedFiles);  

    if (this.files[0]){
      const imageS = this.files;
      this.updateImgForm.controls['photo'].setValue(imageS);
    }

   

  }



  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  //----- Pagination-----

  pageChangeEvent(event: number) {
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

  //------- Search Product----
  search(value: string): void {
    this.searchAllData = this.searchAllData.filter((val: any) => {
      val.name.toLowerCase().includes(value);
    });
  }
}
