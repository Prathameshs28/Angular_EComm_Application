import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from 'src/app/services/http-service/http.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  captchaToken!:any;
  sumitted = false;
  error!: any;
  constructor(
    private route: Router,
    private fb: FormBuilder,
  
    private toastr: ToastrService,
    private http: HttpService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      company: ['', [Validators.required]],
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
      captcha:['']
    });

    this.recaptchaV3Service.execute('importantAction')
    .subscribe({
    next:(token) => {
      // console.log('sub captcha token: ',token)
      this.captchaToken = token;
      
      
    },error:(err)=>{        
      console.log(err);
    }
  });

  }
  getCaptchaToken(){
    this.recaptchaV3Service.execute('importantAction')
    .subscribe({
    next:(token) => {
      // console.log('sub captcha token: ',token)
      this.captchaToken = token;
      
      
    },error:(err)=>{        
      console.log(err);
    }
  });
   }


  get name() {
    return this.registerForm.get('name');
  }

  get company() {
    return this.registerForm.get('company');
  }

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  register() {
    this.sumitted = true;

    this.registerForm.patchValue({captcha:this.captchaToken});

    console.log(this.captchaToken);

    console.log(this.registerForm);

    if (this.registerForm.valid) {
   

      this.http.post('auth/register', this.registerForm.value)

        .subscribe({
          next: (data: any) => {

           this.getCaptchaToken();

            // console.log(data);
            let token = data.token;
            
            setTimeout(()=>{
              this.http.securePost('auth/send-verification-email',token,{captcha:this.captchaToken})
              .subscribe((data: any) => {
                // console.log(data)
                this.toastr.success(
                  'Check your mailbox and verify mail',
                  'Successfully Registered 👍'
                );
                this.route.navigate(['seller/auth/login']);
                this.getCaptchaToken();
              });
            },2000);
          
          },
          error: (err: any) => {
            // this.error = err.error.message;
            this.error = err;
            this.getCaptchaToken();
          },
        });
    }
  }

  login() {
    //back to login
    this.route.navigate(['seller/auth/login']);
  }

  
   

 

}
