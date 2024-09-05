import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  categories: any[] = [];
  posts: any[] = [];
  hotNews: any[] = [];
  promotionNews: any[] = [];
  baseUrl: string = 'http://localhost:8081'; 
  currentPage: number = 1;
  pageSize: number = 2;
  pagedHotNews: any[] = [];
  totalPages: number = 0;
  
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories(); // load categories và sau đó lọc post
    this.loadPosts();      // load bài viết
  }

  // Hàm điều hướng giữa các trang
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }

  // Tải danh mục
  loadCategories(): void {
    this.apiService.get(ConstService.GetAllCategory).subscribe(
      (data) => {
        this.categories = data;
        this.filterPosts();  // Gọi lọc bài viết sau khi categories được tải về
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  // Tải bài viết
  loadPosts(): void {
    this.apiService.get(ConstService.GetAllPost).subscribe(
      (data) => {
        const currentTime = new Date().getTime();
        this.posts = data.filter(post => 
          post.status === "Mở" &&
          new Date(post.fromDate).getTime() <= currentTime &&
          new Date(post.toDate).getTime() >= currentTime
        );
        this.filterPosts();  // Gọi lọc bài viết sau khi posts được tải về
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  // Hàm lọc bài viết dựa trên danh mục
  private filterPosts() {
    if (this.categories.length > 0 && this.posts.length > 0) {
      const newsCategory = this.categories.find(c => c.name.toLowerCase() === 'tin tức');
      if (newsCategory) {
        const childCategories = this.categories.filter(c => c.parentId === newsCategory.categoryId);

        const hotNewsCategory = childCategories.find(c => c.name === 'Tin hot');
        const promotionNewsCategory = childCategories.find(c => c.name === 'Tin khuyến mãi');

        if (hotNewsCategory) {
          this.hotNews = this.posts.filter(post => post.categoryId === hotNewsCategory.categoryId);
          this.paginateHotNews(); 
        }

        if (promotionNewsCategory) {
          this.promotionNews = this.posts.filter(post => post.categoryId === promotionNewsCategory.categoryId);
        }
      }
    }
  }


  paginateHotNews() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedHotNews = this.hotNews.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.hotNews.length / this.pageSize);
  }


goToPage(page: number, event: Event) {
  event.preventDefault(); 
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.paginateHotNews();
  }
}


nextPage(event: Event) {
  event.preventDefault(); 
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.paginateHotNews();
  }
}


previousPage(event: Event) {
  event.preventDefault(); 
  if (this.currentPage > 1) {
    this.currentPage--;
    this.paginateHotNews();
  }
}


  navigateToPostDetail(postId: number) {
    this.apiService.put(`${ConstService.ViewcountPost}/${postId}/increment-view-count`, {})
      .subscribe(() => {
        this.router.navigate(['/blog/detail', postId]);
      });
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