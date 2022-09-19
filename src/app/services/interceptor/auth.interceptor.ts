import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { retry, catchError, Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../storage/storage.service';
import { HttpService } from '../http-service/http.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  url = ['self', 'users'];
  flag = false;
  clonedRequest!: any;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private storageService: StorageService,
    private http: HttpService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log(request.url);

    if(!request.url.includes('shop/auth/self')){
      for (let i = 0; i < this.url.length; i++) {
        let temp = this.url[i];
      
        // console.log(temp);
        if (request.url.includes(temp)) {
          // console.log('url includes', temp);
          this.flag = true;
        }
      }
    }
        
    if (this.flag) {
      // console.log('success');
      this.flag = false;
      this.clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.storageService.getToken()}`,
        },
      });

      return next.handle(this.clonedRequest).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';

          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else if (error.status == 401 && !this.flag) {
            // console.log('flag = true and status = 401:', errorMessage);
            localStorage.clear();
            this.toastr.error(error.error.message, 'Something went wrong!!');
            this.router.navigate(['auth/login']);
          } else {
            errorMessage = `${error.error.message}`;

            // console.log('else error:', errorMessage);
          }

          return throwError(() => errorMessage);
        })
      );
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        errorMessage = `${error.error.message}`;

        // console.log('else error:', errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }
}
