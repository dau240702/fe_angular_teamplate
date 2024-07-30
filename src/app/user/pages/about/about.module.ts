import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    FormsModule,
    CommonModule,

  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [AboutComponent],
})
export class AboutModule {}