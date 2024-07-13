import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    FormsModule,
    CommonModule,

  ],
  exports: [HomeComponent],
})
export class HomeAppModule {}