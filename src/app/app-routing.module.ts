import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import{ServiceComponent} from './pages/service/service.component'
import { ProductComponent } from './pages/product/product.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ProductDetailComponent } from './pages/product/product-detail/product-detail.component';
import { BlogDetailComponent } from './pages/blog/blog-detail/blog-detail.component';
import { ContactComponent } from './pages/contact/contact.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'product', component: ProductComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'product/product-detail', component: ProductDetailComponent },
  { path: 'blog/blog-detail', component: BlogDetailComponent },
  { path: 'contact', component: ContactComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
