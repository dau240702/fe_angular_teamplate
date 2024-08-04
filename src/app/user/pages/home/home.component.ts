import { Component, OnInit } from '@angular/core';
import { Swiper } from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// @ts-ignore
import PureCounter from '@srexi/purecounterjs';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  posts: any[] = [];
  filteredPosts: { [key: string]: any[] } = {};
  activeCategory: string = '';
  childCategories: any[] = []; // Thêm thuộc tính lưu các category con
  baseUrl: string = 'http://localhost:8081'; 
  recentPosts: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }
  ngOnInit() {
    this.Slider();
    new PureCounter();
    this.loadCategories();
    this.loadPosts();
  }
  
  loadCategories(): void {
    this.apiService.get(ConstService.GetAllCategory).subscribe(
      (data) => {
        this.categories = data;
        this.filterPosts();
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadPosts(): void {
    this.apiService.get(ConstService.GetAllPost).subscribe(
      (data) => {
        this.posts = data;
        // Sắp xếp posts theo ngày tạo giảm dần và lấy 4 bài mới nhất
        this.recentPosts = this.posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        this.filterPosts();
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return ''; // Trả về chuỗi rỗng nếu không có đường dẫn
    return `${this.baseUrl}${imagePath}`;
  }

  private filterPosts() {
    const parentCategoryId = this.categories.find(c => c.name === 'tin tức')?.categoryId;
    
    if (parentCategoryId !== undefined) {
      this.childCategories = this.categories.filter(c => c.parentId === parentCategoryId);
      this.filteredPosts = {};

      this.childCategories.forEach(category => {
        this.filteredPosts[category.name] = this.posts.filter(post => post.categoryId === category.categoryId);
      });

      this.activeCategory = this.childCategories.length > 0 ? this.childCategories[0].name : '';
    }
  }

  setActiveCategory(categoryName: string): void {
    this.activeCategory = categoryName;
  }

  Slider() {
    new Swiper('.slides-1', {
      modules: [Navigation, Pagination, Autoplay],
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    new Swiper('.slides-3', {
      modules: [Navigation, Pagination, Autoplay],
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
    new Swiper('.gallery-slider', {
      modules: [Navigation, Pagination, Autoplay],
      speed: 400,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    });
  }
}