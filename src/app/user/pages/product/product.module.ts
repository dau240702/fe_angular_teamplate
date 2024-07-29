import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product.component';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    FormsModule,
    CommonModule,

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [ProductComponent],
})
export class ProductModule {}