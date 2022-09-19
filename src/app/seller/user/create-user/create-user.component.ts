import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
  sumitted = false;
  error!: any;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private storageService: StorageService,
    private toastr: ToastrService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      role: ['', [Validators.required]],
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
    return this.createUserForm.get('name');
  }

  get role() {
    return this.createUserForm.get('role');
  }

  get email() {
    return this.createUserForm.get('email');
  }
  get password() {
    return this.createUserForm.get('password');
  }

  createNew() {
    this.sumitted = true;

    if (this.createUserForm.valid) {
      this.http
        .securePost(
          'users',
          this.storageService.getToken(),
          this.createUserForm.value
        )
        .subscribe({
          next: (data: any) => {
            console.log('Successfully Created', data);

            this.toastr.success('User created Successfully!');

            this.route.navigate(['seller/user/list']);
          },
          error: (err: any) => {
            // this.error = err.error.message;
            this.error = err;
          },
        });
    }
  }

 
}
