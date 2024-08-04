import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogComponent } from './blog.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule


  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [BlogComponent],
})
export class BlogModule {}