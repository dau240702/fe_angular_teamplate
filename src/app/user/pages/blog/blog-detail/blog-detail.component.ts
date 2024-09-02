import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../service/api/api.service';
import { ConstService } from '../../../../../service/const.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent implements OnInit {
  categories: any[] = [];
  posts: any[] = [];
  postId: number | undefined;
  hotNews: any[] = [];
  promotionNews: any[] = [];
  baseUrl: string = 'http://localhost:8081';
  post: any;
  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const postId = params['id'];
      this.loadPostDetail(postId);
    });
    this.loadCategories();
    this.loadPosts();
  }
  loadPostDetail(id: any): void {
    this.postId = id;
    const url = `${ConstService.GetPostId}/${this.postId}`; // Kết hợp ID vào URL
    this.apiService.get(url).subscribe(
      (data) => {
        this.post = data;
      },
      (error) => {
        console.error('Error loading post detail:', error);
      }
    );

  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, true);
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
        this.filterPosts();
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  private filterPosts() {
    if (this.categories.length > 0 && this.posts.length > 0) {
      const newsCategory = this.categories.find(c => c.name.toLowerCase() === 'tin tức');
      if (newsCategory) {
        const childCategories = this.categories.filter(c => c.parentId === newsCategory.categoryId);

        const hotNewsCategory = childCategories.find(c => c.name === 'Tin hot');
        const promotionNewsCategory = childCategories.find(c => c.name === 'Tin khuyến mãi');

        if (hotNewsCategory) {
          this.hotNews = this.posts.filter(post => post.categoryId === hotNewsCategory.categoryId);
        }

        if (promotionNewsCategory) {
          this.promotionNews = this.posts.filter(post => post.categoryId === promotionNewsCategory.categoryId);
        }
      }
    }
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return `${this.baseUrl}${imagePath}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}