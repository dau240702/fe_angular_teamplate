import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/app.shared.module';
import { BlogDetailModule } from '../blog/blog-detail/blog-detail.module';
import { BlogModule } from '../blog/blog.module';
import { HomeAppModule } from '../home/home.module';
import { AppLayoutRoutingModule } from './app-layout-routing.module';
import { AppLayoutComponent } from './app-layout.component';


@NgModule({
  declarations: [AppLayoutComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppLayoutRoutingModule,
    SharedModule,
    HomeAppModule,
    IonicModule,
    BlogModule,
    BlogDetailModule,

  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}