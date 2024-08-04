import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { ContactModule } from '../contact/contact.module';
import { AboutModule } from '../about/about.module';
import { ProductModule } from '../product/product.module';
import { ServiceModule } from '../service/service.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ContactModule,
    AboutModule,
    ProductModule,
    ServiceModule,
    RouterModule

  ], 

  exports: [HomeComponent],
})
export class HomeAppModule {}