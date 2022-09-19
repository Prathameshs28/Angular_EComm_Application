import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  @ViewChild('widgetsContent') widgetsContent!: ElementRef;

  ProdID:any;
  oneProduct:any;

  imgClickIndex:any;
  imgClickFlag = false;



  constructor(private activatedRoute:ActivatedRoute,
    private storageService:StorageService,
    private http:HttpService,
   
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.ProdID = params['id'];
      });
      console.log(this.ProdID);

      this.http.secureGet(`products/${this.ProdID}`,this.storageService.getToken()).subscribe({
      
        next:(res) => {
     
          this.oneProduct = res;
          // console.log(this.oneProduct); 

        

          
        },
        error: (err: any) => {
          // this.error = err;
          console.log(err);
          }
      })



  }

  showBigImg(index:any){

      console.log(index);
      this.imgClickFlag = true;
      this.imgClickIndex = index;
  }


  scrollLeft(){
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }

  scrollRight(){
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }

  // deleteProduct(id: any) {
  //   // console.log(id);
  //   this.http
  //     .secureDelete(`products/${id}`, this.storageService.getToken())
  //     .subscribe({
  //       next: (res) => {
  //         this.toastr.success('', 'Product Deleted');
  //         this.getProductList(this.pageLimit,this.pageNo);
  //       },
  //       error: (err: any) => {
  //         // this.error = err;
  //         console.log(err);
  //       },
  //     });
  // }


}
