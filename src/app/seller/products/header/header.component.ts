import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router:Router,
    private authService: SocialAuthService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
  }

  showMyProfile(){
    this.router.navigate(['seller/home/profile'])
  }

  showProductList(){
    this.router.navigate(['seller/products/list'])
      
  }

  showAllUsers(){
    this.router.navigate(['seller/user/list'])
  }


  logout(){
    this.authService.signOut(true)
      .then(
        (success) => {
          // console.log('logout success',success);
   
        },
        (bad) => {
          // console.log('logout problem',bad);         
        }
      ) 
      .catch((err) => console.log(err));
     
    this.toastr.success('Successfully logged-out');
      sessionStorage.clear();
      // localStorage.clear();
      localStorage.removeItem("UserData");
      this.router.navigate(['seller/auth/login']);
   
  }
}
