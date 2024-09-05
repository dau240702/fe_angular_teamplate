import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared.module';
import { BlogDetailComponent } from './blog-detail.component';

@NgModule({
  declarations: [BlogDetailComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [BlogDetailComponent],
})
export class BlogDetailModule {}