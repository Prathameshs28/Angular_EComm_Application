import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PageService } from 'src/app/services/table-service/page.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  userData!: any;
  p!: number;
  total: number = 0;
  size = 10;
  displayStyle: any;
  deleteID: any;
  modalRef!: BsModalRef;
  editForm!: FormGroup;
  sumitted = false;

  updateID: any;
  updateData!: any;

  searchAllData:any=[];
  searchTerm ='';
  constructor(
    private http: HttpService,
    private storageService: StorageService,
    private route: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private pageService: PageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.p = this.pageService.getPageNumber();
    // console.log(this.p);
    this.getUsers();
  }

  getUsers() {
    // console.log(this.p)
    this.http
      .secureGet(`users?page=${this.p}`, this.storageService.getToken())
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.userData = res;
          this.searchAllData = this.userData; // for search operation
          this.total = this.userData.totalResults;
          console.log(this.userData);
        },
        error: (err: any) => {
          // this.error = err;
          console.log(err);
        }
      });

    this.displayStyle = 'none';
  }

  pageChangeEvent(event: number) {
    // console.log(event);
    this.p = event;
    this.getUsers();
  }

  viewProfile(id: any) {
    // console.log(id);
    this.pageService.setPageNumber(this.p);
    //  console.log(this.p)
    this.toastr.success('', 'User details fetched!');
    this.route.navigate(['seller/user/view', id]);
  }



  deleteUser() {
    // console.log('delete');

    this.http
      .secureDelete(`users/${this.deleteID}`, this.storageService.getToken())
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.closePopup();
          this.toastr.error('', 'User Deleted');
          this.getUsers();
        },
        error: (err: any) => {
          // this.error = err;
          console.log(err);
        },
      });
  }

  openPopup(id: any) {
    this.deleteID = id;
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }



  updateForm() {
    // console.log('edit');
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$'
          ),
        ],
      ],
    });
  }

  get name() {
    return this.editForm.get('name');
  }

  get email() {
    return this.editForm.get('email');
  }
  get password() {
    return this.editForm.get('password');
  }

  openModal(modalTemplate: TemplateRef<any>, editID: any) {
    this.modalRef = this.modalService.show(modalTemplate, {
      class: 'modal-dialogue-centered modal-md',
      backdrop: 'static',
      keyboard: true,
    });

    this.updateID = editID;
    // console.log(this.updateID);
    this.updateForm();

    this.http
      .secureGet(`users/${this.updateID}`, this.storageService.getToken())
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.updateData = res;

          // console.log(this.updateData);

          this.name?.setValue(this.updateData.name);
          this.email?.setValue(this.updateData.email);
        },
        error: (err: any) => {
          // this.error = err;
          console.log(err);
        },
      });
  }

  backToList() {
    this.modalRef.hide();
  }

  update() {
    this.sumitted = true;

    this.http
      .securePatch(
        `users/${this.updateID}`,
        this.storageService.getToken(),
        this.editForm.value
      )
      .subscribe({
        next: (res) => {
          this.modalRef.hide();
          this.toastr.success('', 'User details updated!');

          this.getUsers();
        },
        error: (err: any) => {
          // this.error = err;

          console.log(err, 'update field');
        },
      });
  }

  createUser() {
    this.route.navigate(['seller/user/create']);
  }

  // ----- search operation-----

  search(value: string): void {

    this.searchAllData=this.searchAllData?.results;
    // console.log(this.searchAllData);

    let listArray=[];
    for(let i=0;i<this.searchAllData?.length;i++){
        listArray.push(this.searchAllData[i].name);
    }
    // console.log(listArray);

    listArray = listArray.filter((val:any) =>{
      val.toLowerCase().includes(value);   
      // console.log(val)
    })

    listArray = [];


}


}
