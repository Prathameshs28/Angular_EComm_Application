import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css'],
})
export class AddressesComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  allAddresses: any;

  ngOnInit(): void {
    this.loadAllAddress();

    this.addAddress();
  }

  loadAllAddress() {
    this.http
      .secureGet('customers/address', this.storageService.getCustomerToken())
      .subscribe({
        next: (res) => {
          this.allAddresses = res;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
        },
      });
  }

  // ----- add new address-------------

  displayStyle = 'none';
  addressForm!: FormGroup;
  sumitted = false;

  closePopup() {
    this.sumitted = false;
    this.addressForm.reset();
    this.displayStyle = 'none';
  }

  openPopupAddNewAdd() {

    
    this.updateBtn = false;
    this.displayStyle = 'block';

  }

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
    if (this.addressForm.valid) {
      this.http
        .securePost(
          'customers/address',
          this.storageService.getCustomerToken(),
          this.addressForm.value
        )
        .subscribe({
          next: (res) => {
            this.loadAllAddress();
            this.sumitted = false;
            this.closePopup();
            this.toastr.success('New address added successfully!!');
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
          },
        });
    }
  }

  deleteAddress(id: any) {
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
        this.sweetAlertDeleteAddress(id);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  sweetAlertDeleteAddress(id: any) {

    this.http
      .secureDelete(
        `customers/address/${id}`,
        this.storageService.getCustomerToken()
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.loadAllAddress();
          this.toastr.success('Address deleted');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  showAddress(id: any) {
    this.http
      .secureGet(
        `customers/address/${id}`,
        this.storageService.getCustomerToken()
      )
      .subscribe({
        next: (res) => {
          this.showAddSweetAlert(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  showAddSweetAlert(data: any) {
    Swal.fire(
      `Street: ${data.street} 
      \nAddress Line 2: ${data.addressLine2}
      \nCity: ${data.city}
      \nState: ${data.state}
      \nPin: ${data.pin}
      `
    );
  }

  //---------update address -----------------

  updateBtn = false;
  updateID:any;

  updateAddress(id: any) {
    this.updateID = this.allAddresses[id]?._id;
    this.openPopupAddNewAdd();
    this.updateBtn = true;   
    
    this.addressForm.setValue({
      street: this.allAddresses[id]?.street,
      addressLine2: this.allAddresses[id]?.addressLine2,

      city: this.allAddresses[id]?.city,
      state: this.allAddresses[id]?.state,
      pin: this.allAddresses[id]?.pin
    });
  }


  updateCustAddress(){
    this.http.securePut(`customers/address/${this.updateID}`,this.storageService.getCustomerToken(),this.addressForm.value)
    .subscribe({
      next:(res)=>{
        console.log(res);
        this.loadAllAddress();
        this.closePopup();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  backToProfile() {
    this.router.navigate(['self/profile']);
  }
}
