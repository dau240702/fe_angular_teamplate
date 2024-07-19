import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, provideHttpClient, withFetch ,withInterceptors} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { authInterceptor } from '../service/auth/AuthInterceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    
    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_LOCALE },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
