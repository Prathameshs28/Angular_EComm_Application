import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class searchFilter implements PipeTransform {
  transform(arr: any, value: string) {
    if (!arr) {
      return [];
    }
    if (!value) {
      return arr;
    }

    let searchText: any = value.toLocaleLowerCase();

   
    let searchedValue = arr.filter((item: any) => {
        
        if(item.name.toLocaleLowerCase().includes(value)){
            return item;
        }

    });
    // console.log(searchedValue);
    return searchedValue;
  }
}
