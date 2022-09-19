import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  captchaToken!: any;
  sumitted = false;
  error!: any;
  constructor(
    private route: Router,
    private fb: FormBuilder,

    private toastr: ToastrService,
    private http: HttpService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {

    this.getCaptchaToken();
    
    this.registerForm = this.fb.group({
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
      addresses: new FormArray([]),
      captcha: [''],
    });

    this.addAddress();

  
  }

  getCaptchaToken() {
    this.recaptchaV3Service.execute('importantAction').subscribe({
      next: (token) => {
        // console.log('sub captcha token: ',token)
        this.captchaToken = token;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  get addresses() {
    return this.registerForm.get('addresses') as FormArray;
  }

  addAddress() {
    this.addresses.push(
      this.fb.group({
        street: ['', [Validators.required]],
        addressLine2: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pin: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      })
    );
  }

  register() {
    this.sumitted = true;

    this.registerForm.patchValue({captcha:this.captchaToken});

    // console.log('reg capthca: ',this.captchaToken);

    // console.log(this.registerForm.value);

    if (this.registerForm.valid) {
      this.http
        .post('shop/auth/register', this.registerForm.value)
        .subscribe({
          next: (data) => {
            // console.log('registered data: ', data);
            this.route.navigate(['auth/login']);
          },
          error: (err) => {
            this.error = err;
            console.log(err);
          },
          complete: () => {
            // console.log('registration successfully done');
            this.toastr.success('', 'Successfully Registered 👍');
          },
        });
    }
    
  }


}
