import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppAdminSharedModule } from '../../shared/app-admin.share.module';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MainLayoutRoutingModule,
    AppAdminSharedModule,
  ],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {}
