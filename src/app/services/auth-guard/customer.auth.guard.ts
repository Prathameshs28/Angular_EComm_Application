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
export class CustomerAuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private route: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.storageService.checkCustomerLocalToken()) {
      // console.log('route: ',route,'state: ',state);
      this.toastr.error('', 'Please Authenticate');
      this.route.navigateByUrl('auth/login');
      return false;
    }

    return true;
  }
  

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
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
