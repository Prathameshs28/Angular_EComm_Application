import { Component, OnDestroy, OnInit } from '@angular/core';
import {

  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';
import { Editor, schema, toHTML, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit,OnDestroy {
  productForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private storageService: StorageService,
    private router:Router,
    private toastr: ToastrService,
  ) {}

  editor!: Editor;
  html: any='';
  
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

  sumitted = false;
  files: File[] = [];


  ngOnInit(): void {
    this.editor = new Editor();

    this.productForm = this.fb.group({
      name: new FormControl( '', [Validators.required]),
      photo: new FormControl('',[Validators.required]),
      price: new FormControl('',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
      description: new FormControl('', [Validators.required]),
    });
  }


  ngOnDestroy(): void {
    this.editor.destroy();
  }


  get f() {
    return this.productForm.controls;
  }
 

  addProduct() {
    this.sumitted = true;

    const formData = new FormData();


    for (let i = 0; i < this.productForm.value.photo.length; i++) {
      formData.append('images', this.productForm.value.photo[i]);
    }


   

    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description); 
    formData.append('price', this.productForm.value.price);

  


    if (this.productForm.valid) {
      this.http
        .secureProdPost('products', this.storageService.getToken(), formData)
        .subscribe({
          next: (data: any) => {
            this.toastr.success('Product created Successfully!');
            this.router.navigate(['seller/products/list'])
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }

   
  }

  onSelectFile(e: any) {

    this.files.push(...e.addedFiles); 
    if (this.files[0]){
      console.log(this.files);
      const imageS = this.files;
      this.productForm.controls['photo'].setValue(imageS);
    }

  
  }

  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


 

 
}



