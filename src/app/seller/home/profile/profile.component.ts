import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-myprofile',
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

  constructor(
    private route: Router,
    private toastr: ToastrService,
    private http: HttpService,
    private storageService: StorageService,
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.http.secureGet('auth/self', this.storageService.getToken()).subscribe({
      next: (res) => {
        this.userProfileData = res;

        if (this.userProfileData?.isEmailVerified) {
          this.verifyMail = true;
        }

        this.load = false;
      },
      error: (err: any) => {
        this.error = err;
      },
    });
  }

 


  
  


}
