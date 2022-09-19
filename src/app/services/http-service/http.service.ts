import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get(url: string, queryParams?: any) {
    return this.http.get(environment.baseUrl + url + '?' + queryParams);
  }

  post(url: string, data?: any) {
    return this.http.post(environment.baseUrl + url, data);
  }

  secureGet(url: string, token: any, queryParams?: any) {
    let headers = this.getHeader(token);
    return this.http.get(environment.baseUrl + url, { headers });
  }

  securePost(url: string, token: any, data?: any) {
    // secure post means when we send header
    let headers = this.getHeader(token);
    return this.http.post<any>(environment.baseUrl + url, data, { headers });
  }

  secureDelete(url: string, token: any, data?: any) {
    let headers = this.getHeader(token);
    return this.http.delete(environment.baseUrl + url, { headers });
  }

  securePatch(url: string, token: any, data?: any) {
    // console.log(token);
    let headers = this.getHeader(token);
    return this.http.patch(environment.baseUrl + url, data, { headers });
  }

  securePut(url: string, token: any, data?: any) {
    // console.log(token);
    let headers = this.getHeader(token);
    return this.http.put(environment.baseUrl + url, data, { headers });
  }


  verifyMail(verfiyToken: any) {
    let finalurl =
      environment.baseUrl + 'auth/verify-email?token=' + verfiyToken;
    let data = '';

    return this.http.post<any>(finalurl, data);
  }



  
  resetPassword(resetToken: any) {
    let finalurl =
      environment.baseUrl + 'shop/auth/reset-password?token=' + resetToken;
    let data = '';

    return this.http.post<any>(finalurl, data);
  }




  getHeader(token: any) {
    // console.log(token)
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // create new product

  secureProdPost(url: string, token: any, data?: any) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(environment.baseUrl + url, data, { headers });
  }

  // update images

  secureProdPatch(url: string, token: any, data?: any) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<any>(environment.baseUrl + url, data, { headers });
  }
}
