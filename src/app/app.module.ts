import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageService } from './services/storage/storage.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './services/interceptor/auth.interceptor';

import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';

import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { StoreModule } from '@ngrx/store';
import { cartReducer } from './customer/cart/state/cart.reducer';

import { MetaReducer } from '@ngrx/store';
import { hydrationMetaReducer } from './store/cartHydration.reducer';



export const metaReducers: MetaReducer[] = [hydrationMetaReducer];



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    RecaptchaV3Module,
    StoreModule.forRoot({ cart: cartReducer },{metaReducers})

    
  ],
  providers: [
    StorageService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',

      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'here google provider key'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('here facebook provider key'),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: 'here recaptcha site key',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
