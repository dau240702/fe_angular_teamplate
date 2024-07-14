import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../service/authguard.service';
import { LoginComponent } from './login/login.component';
import { MainLayoutModule } from './admin/pages/main-layout/main-layout.module';
import { AppLayoutComponent } from './user/pages/app-layout/app-layout.component';
import { AppLayoutModule } from './user/pages/app-layout/app-layout.module';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/pages/main-layout/main-layout.module').then(m => m.MainLayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AppLayoutComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MainLayoutModule,
    AppLayoutModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
