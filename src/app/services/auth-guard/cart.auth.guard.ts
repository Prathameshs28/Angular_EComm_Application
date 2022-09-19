import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartAuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private route: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.storageService.hascheckOutPermission()) {

        this.toastr.error('', 'Access Denied');
        
        this.route.navigateByUrl('cart/cart-items');
        return false;
      }
  
      if (!this.storageService.hasPayPermission()) {
        this.toastr.error('', 'Access Denied!');
        this.route.navigateByUrl('cart/cart-items');
        return false;
      }
  
      return true;
  }
  

 
}
