import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(private http:HttpService,private storageService:StorageService,private route:Router,
    private activatedRoute:ActivatedRoute) { }
  userData!:any;
  ID!:any;
  mailVerify = false;
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.ID = params['id'];
      });
      console.log(this.ID);


      this.http.secureGet(`users/${this.ID}`,this.storageService.getToken()).subscribe({
      
        next:(res) => {
          // console.log(res);
          this.userData = res;
        
          // console.log(this.userData)
          if(this.userData?.isEmailVerified){
            this.mailVerify = true;
          }

          // console.log(this.mailVerify)
          
        },
        error: (err: any) => {
          // this.error = err;
          console.log(err);
          }
      })
  }



}
