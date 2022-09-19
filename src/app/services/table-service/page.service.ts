import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PageService {
  page:number=1;
  limit:number=10;
  viewed:boolean=false;

     constructor() {}

  setPageNumber(p:number){
      this.page = p;
  }

  getPageNumber(){
    return this.page;
  }


  setPageLimit(size:number){
    this.limit = size;
}

getPageLimit(){
  return this.limit;
}


setViewFlag(flag:boolean){
  
  this.viewed =flag ;

  // console.log(this.viewed)
}

getViewFlag(){
  return this.viewed;
}


}
