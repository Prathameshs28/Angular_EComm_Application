import { Injectable } from '@angular/core';
import {  CanActivate,Router} from '@angular/router';

import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storageService:StorageService, private route:Router ){}

  canActivate(){
       if(!this.storageService.checkLocalToken()){
        this.route.navigateByUrl('auth/login');
      return false;
    }else{
      return true;
    }
    
  }

  
  

}
