import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StyleManagerService } from '../service/style-manager.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'fe_angular_teamplate';
  constructor(
    private router: Router,
    private styleManager: StyleManagerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (event.url.startsWith('/admin')) {
            this.loadAdminStyles();
            this.loadAdminScripts();
          }
        }
      });
    }
  }

  loadAdminStyles() {
    this.styleManager.setStyles('admin-theme',
      'assets/admin/vendor/bootstrap/css/bootstrap.min.css',
      'assets/admin/vendor/bootstrap-icons/bootstrap-icons.css',
      'assets/admin/vendor/boxicons/css/boxicons.min.css',
      'assets/admin/vendor/quill/quill.snow.css',
      'assets/admin/vendor/quill/quill.bubble.css',
      'assets/admin/vendor/remixicon/remixicon.css',
      'assets/admin/vendor/simple-datatables/style.css',
      'assets/admin/css/style.css'
    );
  }

  loadUserStyles() {
    this.styleManager.setStyles('user-theme',
    );
  }

  loadAdminScripts() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadScripts(
        'assets/admin/vendor/apexcharts/apexcharts.min.js',
        'assets/admin/vendor/bootstrap/js/bootstrap.bundle.min.js',
        'assets/admin/vendor/chart.js/chart.umd.js',
        'assets/admin/vendor/echarts/echarts.min.js',
        'assets/admin/vendor/quill/quill.min.js',
        'assets/admin/vendor/simple-datatables/simple-datatables.js',
        'assets/admin/vendor/tinymce/tinymce.min.js',
        'assets/admin/vendor/php-email-form/validate.js',
        'assets/admin/js/mainadmin.js'
      );
    }
  }

  loadUserScripts() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadScripts(
        'assets/user/vendor/bootstrap/js/bootstrap.bundle.min.js',
        'assets/user/vendor/aos/aos.js',
        'assets/user/vendor/glightbox/js/glightbox.min.js',
        'assets/user/vendor/swiper/swiper-bundle.min.js',
        'assets/user/vendor/isotope-layout/isotope.pkgd.min.js',
        'assets/user/vendor/php-email-form/validate.js',
        'assets/user/js/mainuser.js'
      );
    }
  }
  loadScripts(...srcs: string[]) {
    if (isPlatformBrowser(this.platformId)) {
      srcs.forEach(src => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      });
    }
  }
}
