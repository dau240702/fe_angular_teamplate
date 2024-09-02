import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared.module';
import { AboutModule } from '../about/about.module';
import { ContactModule } from '../contact/contact.module';
import { ProductModule } from '../product/product.module';
import { ServiceModule } from '../service/service.module';
import { HomeComponent } from './home.component';

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
    RouterModule,
    SharedModule
  ], 

  exports: [HomeComponent],
})
export class HomeAppModule {}