import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentDTO } from '../../../../../model/CommentDTO';
import { ApiService } from '../../../../../service/api/api.service';
import { ConstService } from '../../../../../service/const.service';
import { NotificationService } from '../../../../../service/Notification/notification.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent implements OnInit {
  commentForm: FormGroup;
  categories: any[] = [];
  posts: any[] = [];
  postId: number | undefined;
  hotNews: any[] = [];
  promotionNews: any[] = [];
  baseUrl: string = 'http://localhost:8081';
  post: any;
  comments: any[] = [];
  commentsCount: number = 0;
  
  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute, private fb: FormBuilder, private notificationService: NotificationService

  ) {

    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      content: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const postId = +params.get('postId')!;

      if (postId) {
        this.postId = postId;
        this.incrementViewCount(this.postId);
        this.loadPostDetail(this.postId);
      } else {
        console.error('postId not found in URL');
      }
    });
    this.getCommentsByPostId();
    this.loadCategories();
    this.loadPosts();
  }
  getCommentsByPostId() {
    this.apiService.get(`${ConstService.GetAllCommentsByPostId}/${this.postId}`)
      .subscribe(
        (response) => {
          this.comments = response;
          this.commentsCount = this.comments.length; ; 
        },
        (error) => {
          console.error('Error fetching comments:', error);
        }
      );
  }
  onSubmit() {
    if (this.commentForm.valid) {
      const contactData: CommentDTO = this.commentForm.value;
      contactData.postId = this.postId;
      this.apiService.post(ConstService.AddComment, contactData).subscribe(
        (response: CommentDTO) => {
          this.notificationService.success('Bình luận của bạn đã được gửi thành công.');
          this.commentForm.reset();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi gửi bình luận.');
        }
      );
    }
  }

  incrementViewCount(postId: number) {
    this.apiService.put(`${ConstService.ViewcountPost}/${postId}/increment-view-count`, {})
      .subscribe(() => {
        console.log(`Viewcount for post ${postId} incremented`);
      });
  }
  loadPostDetail(id: any): void {
    id = this.postId
    this.apiService.get(`${ConstService.GetPostId}/${id}`).subscribe(
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
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadPosts(): void {
    this.apiService.get(ConstService.GetAllPost).subscribe(
      (data) => {
        const currentTime = new Date().getTime();
        this.posts = data.filter(post =>
          post.status === "Mở" &&
          new Date(post.fromDate).getTime() <= currentTime &&
          new Date(post.toDate).getTime() >= currentTime
        );


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

  navigateToPostDetail(postId: number) {
    this.apiService.put(`${ConstService.ViewcountPost}/${postId}/increment-view-count`, {})
      .subscribe(() => {
        this.router.navigate(['/blog/detail', postId]);
      });
  }

}