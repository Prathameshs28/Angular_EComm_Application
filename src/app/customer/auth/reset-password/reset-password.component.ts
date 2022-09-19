import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private route: ActivatedRoute,

    private router: Router,
    private toastr: ToastrService,
    private http: HttpService) { }

    resetToken:any;
    error:any;

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      console.log(params)
      this.resetToken = params['token'];
      console.log(this.resetToken);

      // this.http.resetPassword(this.resetToken).subscribe({
      //   next: (data: any) => {
      //     // this.toastr.success('Successfully mail verified 👍');
      //     // this.router.navigate(['seller/auth/login']);
      //     console.log(data);
      //   },
      //   error: (err) => {
          
      //     // console.log(this.error)
      //     this.error = err;
      //   },
      // });



    });

  }

}
