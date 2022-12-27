import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  error!: any;
  token!: any;

  invalidToken = false;

  constructor(
    private route: ActivatedRoute,

    private router: Router,
    private toastr: ToastrService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params)
      this.token = params['token'];
      this.http.verifyMail(this.token).subscribe({
        next: (data: any) => {
          this.toastr.success('Successfully mail verified 👍');
          this.router.navigate(['seller/auth/login']);
        },
        error: (err) => {
          
          this.error = err;
        },
      });
    });
  }

  backToLogin(){
    this.router.navigate(['seller/auth/login']);
  }

 }
