import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppAdminSharedModule } from '../../shared/app-admin.share.module';
import { CategoryManagementModule } from '../category-management/category-management.module';
import { ContactManagementModule } from '../contact-management/contact-management.module';
import { HomeManagementModule } from '../home/home-admin.module';
import { NewsManagementModule } from '../news-management/news-management.module';
import { ProductManagementModule } from '../product-management/product-management.module';
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
    CategoryManagementModule,
    ProductManagementModule,
    ContactManagementModule,
    NewsManagementModule,
    HomeManagementModule
  ],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {}
