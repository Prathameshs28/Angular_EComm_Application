import { SocialAuthService } from '@abacritt/angularx-social-login';
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
import Swal from 'sweetalert2';
import { ImageCroppedEvent, LoadedImage, Dimensions } from 'ngx-image-cropper';
import { Obj } from '@popperjs/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  localData!: any;
  userToken!: any;
  userProfileData!: any;
  error!: any;
  load = true;
  verifyMail = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  lowerHeader = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpService,
    public storageService: StorageService,
    private authService: SocialAuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUserDeatils();
    this.makeImageUpdateForm();
    this.makeUpdateForm();

    if (this.storageService.checkCustomerLocalToken()) {
      this.lowerHeader = true;
    }
  }

  loadUserDeatils() {
    this.http
      .secureGet('shop/auth/self', this.storageService.getCustomerToken())
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.userProfileData = data;
          // console.log(this.userProfileData)
        },
        error: (err) => {
          console.log('cust self error: ', err);
        },
        complete: () => {
          // console.log('self completed');
        },
      });
  }

  //   logout() {
  //     if(this.storageService.checkCustomerLocalToken()){
  //       this.toastr.success('Successfully logged-out');
  //       localStorage.removeItem('CustomerData');
  //       this.router.navigate(['auth/login']);
  //   }

  // }

  // ---------------- addresses --------------------

  showAddresses() {
    this.router.navigate(['self/addresses']);
  }

  showOrder() {
    this.router.navigate(['self/orders']);
  }
  //------------------ modal profile picture------------------

  imageUpdateForm!: FormGroup;
  displayStyle = 'none';
  imageSelected = false;

  makeImageUpdateForm() {
    this.imageUpdateForm = this.fb.group({
      photo: new FormControl('', [Validators.required]),
    });
  }

  openPopup() {
    this.makeImageUpdateForm();
    this.displayStyle = 'block';
  }

  closePopup() {
    this.displayStyle = 'none';
    this.imageUpdateForm.reset();

    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.imageSelected = false;
  }

  //----------- code convert base64 to file -------------------------

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0]?.indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0]?.split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  // ----------------------------------------------------------------------

  updateProfilePicture() {
    // console.log(this.croppedImage);
    const file = this.DataURIToBlob(this.imageUpdateForm.value.photo);
    const fd = new FormData();
    // console.log('form photo value',  this.imageUpdateForm.value.photo);

    // fd.append('picture', this.imageUpdateForm.value.photo);

    fd.append('picture', file);

    this.http
      .secureProdPost(
        'customers/profile-picture',
        this.storageService.getCustomerToken(),
        fd
      )
      .subscribe({
        next: (data: any) => {
          // console.log(data);
          this.toastr.success('Image Updated Successfully!');

          this.loadUserDeatils();

          this.closePopup();
        },
        error: (err: any) => {
          // this.error = err.error.message;
          console.log(err);
        },
      });
  }

  onSelectFile(e: any) {
    this.imageChangedEvent = e;
    this.imageSelected = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    const imageS = this.croppedImage;
    // console.log('target images',imageS)
    this.imageUpdateForm.controls['photo'].setValue(imageS);
  }

  removeProfilePicture() {
    this.http
      .secureDelete(
        'customers/profile-picture',
        this.storageService.getCustomerToken()
      )
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.toastr.success('', 'Profile Image deleted successfully!!');
          this.loadUserDeatils();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteProfileImgSweet() {
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
        this.removeProfilePicture();
        Swal.fire(
          'Deleted!',
          'Your Profile Picture has been deleted.',
          'success'
        );
      }
    });
  }

  //------------------ modal update user details ------------------

  custdetailsdisplayStyle = 'none';
  editForm!: FormGroup;
  sumitted = false;

  openPopupCustUpdateDetails() {
    this.custdetailsdisplayStyle = 'block';

    this.editForm.setValue({
      name: this.userProfileData?.name,
      email: this.userProfileData?.email,
    });
  }

  closePopupCustUpdateDetails() {
    this.custdetailsdisplayStyle = 'none';
    this.error = null;
  }

  makeUpdateForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
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

  userName: any;

  updateUserDetails() {
    this.sumitted = true;

    this.http
      .securePatch(
        `customers/update-profile`,
        this.storageService.getCustomerToken(),
        this.editForm.value
      )
      .subscribe({
        next: (res) => {
          this.userName = res;
          this.userName = this.userName.name;
          // console.log(this.userName);
          localStorage.setItem('userName', this.userName);

          let name = this.userName.split(' ');
          this.userName = name[0];
          this.storageService.userName = this.userName;

          this.custdetailsdisplayStyle = 'none';
          this.toastr.success('', 'User details updated!');
          this.loadUserDeatils();
        },
        error: (err: any) => {
          this.error = err;
          console.log(err, 'update field');
        },
      });
  }

  //------------- delete account --------------------

  deleteAccount() {
    this.http
      .secureDelete('customers/account', this.storageService.getCustomerToken())
      .subscribe({
        next: (res) => {
          console.log(res);
          this.toastr.success('', 'User deleted successfully!!');
          this.router.navigate(['products']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteAccoutSweet() {
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
        this.deleteAccount();
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
      }
    });
  }
}
