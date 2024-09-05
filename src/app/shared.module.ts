import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDatePipe } from './custom-date.pipe';

@NgModule({
  declarations: [CustomDatePipe],
  imports: [CommonModule],
  exports: [CustomDatePipe]  // Export CustomDatePipe để có thể sử dụng ở các module khác
})
export class SharedModule { }
