import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {AppLayoutRoutingModule } from './app-layout-routing.module';
import { AppLayoutComponent } from './app-layout.component';
import { HomeAppModule } from '../home/home.module';
import { SharedModule } from '../../shared/app.shared.module';
import { IonicModule } from '@ionic/angular';
import { BlogModule } from '../blog/blog.module';


@NgModule({
  declarations: [AppLayoutComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppLayoutRoutingModule,
    SharedModule,
    HomeAppModule,
    IonicModule,
    BlogModule

  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}