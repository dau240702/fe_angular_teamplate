import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsManagementComponent } from './news-management.component';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [NewsManagementComponent],
  exports: [NewsManagementComponent],
  providers: [DatePipe],
  imports: [
    CommonModule, // Add CommonModule here
    HttpClientModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class NewsManagementModule { }