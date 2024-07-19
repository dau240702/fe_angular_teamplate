import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { HomeComponent } from '../home/home.component';
import { NewsManagementComponent } from '../news-management/news-management.component';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { AuthGuard } from '../../../../service/authguard.service';
import { ContactManagementComponent } from '../contact-management/contact-management.component';
import{CategoryManagementComponent} from '../category-management/category-management.component'

const routes: Routes = [
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'statical-management',
        component: HomeComponent,
      },
      {
        path: 'news-management',
        component: NewsManagementComponent,
      },
      {
        path: 'product-management',
        component: ProductManagementComponent,
      },
      {
        path: 'contact-management',
        component: ContactManagementComponent,
      },
      {
        path: 'category-management',
        component: CategoryManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule],
})
export class MainLayoutRoutingModule {}
