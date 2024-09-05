import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { BlogDetailComponent } from '../blog/blog-detail/blog-detail.component';
import { BlogComponent } from '../blog/blog.component';
import { ContactComponent } from '../contact/contact.component';
import { HomeComponent } from '../home/home.component';
import { ProductComponent } from '../product/product.component';
import { ServiceComponent } from '../service/service.component';
import { AppLayoutComponent } from './app-layout.component';


const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,

    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'service',
        component: ServiceComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      }, { path: 'blog/detail/:postId', component: BlogDetailComponent },

      {
        path: 'blog',
        component: BlogComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule],
})
export class AppLayoutRoutingModule { }
