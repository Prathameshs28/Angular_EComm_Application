import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Captchv3Service } from 'src/app/services/captcha-service/captchv3.service';

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

  public user: SocialUser = new SocialUser();

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storageService: StorageService,
    private http: HttpService,
    private authService: SocialAuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private _ngZone: NgZone,
    private fbCaptcha: Captchv3Service
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

    if (this.storageService.getLocal()) {
      this.route.navigate(['seller/home/profile']);
    }

   
    this.authService.authState.subscribe((data) => {
      this.user = data;

      this.googleToken = data?.idToken;


      if (
        this.googleToken != this.storageService.getOldToken() &&
        data?.idToken
      ) {
        this.storageService.setOldToken(this.googleToken);

        this.http
          .post('auth/login/google', {
            token: `${this.googleToken}`,
            captcha: `${this.captchaToken}`,
          })
          .subscribe({
            next: (data) => {
              this.refreshCaptcha();
              this.gToken = JSON.parse(JSON.stringify(data));


              this.storageService.setLocal(this.gToken);

              this.toastr.success('Successfully logged in');
              this.route.navigate(['seller/home/profile']);
              this.refreshCaptcha();
            },
            error: (err) => {
              this.refreshCaptcha();
            },
          });
      }
    });
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
    this.route.navigate(['seller/auth/register']);
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

    console.log(this.loginForm.value)

    if (this.loginForm.valid) {
      this.http.post('auth/login', this.loginForm.value).subscribe({
        next: (data: any) => {
          this.storageService.setLocal(data);

          this.toastr.success('Successfully logged-in');
          this.route.navigate(['seller/home/profile']);

          this.refreshCaptcha();
        },
        error: (err) => {
          this.error = err;
        },
      });
    }
  }

  facebookLogin() {
    this.fbCaptcha.loadAndInitFBSDK();

    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data) => {
      this.fbToken = data?.authToken;

      this.http
        .post('auth/login/facebook', {
          token: `${this.fbToken}`,
          captcha: `${this.captchaToken}`,
        })
        .subscribe({
          next: (data) => {
            const fToken = JSON.parse(JSON.stringify(data));


            this.storageService.setLocal(fToken);

            this.toastr.success('Successfully logged in');
            this.route.navigate(['seller/home/profile']);
            this.refreshCaptcha();
          },
          error: (err) => {
            this.refreshCaptcha();
          },
        });
    });
  }
}
