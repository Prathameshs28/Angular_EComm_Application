import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpService } from 'src/app/services/http-service/http.service';

import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  sumitted = false;
  error!: any;

  token!: any;

  subscribtion!: any;

  googleToken!: any;
  fbToken!: any;
  gToken!: any;

  captchaToken!: any;
  forgotPassForm!:FormGroup;
  ForgotSub = false;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public storageService: StorageService,
    private http: HttpService,

    private recaptchaV3Service: ReCaptchaV3Service,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.refreshCaptcha();
    
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required]],
      captcha: [''],
    });

    this.forgotPassForm = new FormGroup({
      email: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      captcha: new FormControl('')   
    })

  }

  

  get email() {
    return this.loginForm.get('email');
  }

  get captcha() {
    return this.loginForm.get('captcha');
  }

  get password() {
    return this.loginForm.get('password');
  }

  register() {
    this.route.navigate(['auth/register']);
  }

  refreshCaptcha() {
    this.recaptchaV3Service.execute('importantAction').subscribe({
      next: (token) => {
     
        this.captchaToken = token;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  login() {
    this.sumitted = true;

    this.loginForm.patchValue({ captcha: this.captchaToken });

   

    if (this.loginForm.valid) {
      this.http.post('shop/auth/login', this.loginForm.value).subscribe({
        next: (data: any) => {
    
          this.storageService.setCustomerLocal(data);

          localStorage.setItem('userName', data.customer.name);
          let name = data.customer.name.split(' ');
          this.storageService.userName = name[0];

          this.toastr.success('Successfully logged-in');

          if (
           
            this.storageService.getCartState() ||
            localStorage.getItem('BuyNowProd')
          ) {
            this.route.navigate(['cart/checkout']);
          } else {
            this.route.navigate(['self/profile']);
          }

          this.refreshCaptcha();
        },
        error: (err) => {
          this.error = err;
       
          this.refreshCaptcha();
        },
        complete: () => {
      
        },
      });
    }
  }


  // forgot password

  closeForgotPass(){
    this.ForgotSub = false;
    this.forgotPassForm.reset();
    console.log('closed');
  }
  

  forgotPassConfirm(){
   
    this.ForgotSub = true;
    this.forgotPassForm.patchValue({ captcha: this.captchaToken });
      console.log(this.forgotPassForm.value); 

    if(this.forgotPassForm.valid){
     
      this.http.post('shop/auth/forgot-password', this.forgotPassForm.value).subscribe({
        next: (data: any) => {
          this.toastr.success('Kindly check your mail password reset link sent');
        },
        error:(err) =>{
          console.log(err);
        }
      })

    }
  }


  showForgotPasswordError() {
    const emailValue: any = this.forgotPassForm.get('email');

    if (!this.forgotPassForm.valid && emailValue.touched) {
      if (emailValue.errors?.['required']) {
        return 'Email is required';
      }

      if (emailValue.errors?.['pattern']) {
        return 'Please enter valid email';
      }
    }

    if (emailValue.untouched && this.ForgotSub) {
      if (emailValue.errors?.['required']) {
        return 'Email is required';
      }
    }

    return '';
  }


}
