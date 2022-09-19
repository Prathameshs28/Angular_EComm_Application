import { Injectable } from '@angular/core';


declare global {
  interface Window {
      FB:any;
      fbAsyncInit:any
  }
}

@Injectable({
  providedIn: 'root'
})



export class Captchv3Service {

 FB = window.FB;

  constructor(    ) { 

   

    if (!window.fbAsyncInit)  {
      // console.log('define');
      window.fbAsyncInit = function () {
     this.FB.init({
          appId: "365586852354146",
          xfbml: false,
          version: 'v3.3'
                
        });
      };
    }

  }


  loadAndInitFBSDK():any{
    var js,
      id = 'facebook-jssdk',
      ref = document.getElementsByTagName('script')[0];

    if (document.getElementById(id)) {
      return;
    }

    js = document.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "https://connect.facebook.net/en_US/sdk.js";  
    
    // js.src = "http://connect.facebook.net/en_US/all.js";
  
    
  }




  



}
