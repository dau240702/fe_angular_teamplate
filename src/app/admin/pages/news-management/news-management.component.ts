import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { UserService } from '../../../../service/user.service';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { ConstService } from '../../../../service/const.service';
import Swal from 'sweetalert2';
import { PostDTO } from '../../../../model/PostDTO';

@Component({
  selector: 'app-news-management',
  templateUrl: './news-management.component.html',
  styleUrl: './news-management.component.css'
})
export class NewsManagementComponent implements OnInit {
  allPosts: PostDTO[] = [];
  addPostForm: FormGroup;
  editPostForm: FormGroup;
  filteredPosts: PostDTO[] = [];
  totalItems: PostDTO[] = [];
  offset = 0;
  userId: number | null = null;
  currentPostId: number | null = null;
  columns = [
    { prop: 'title', name: 'Tiêu đề' },
    { prop: 'categoryId', name: 'Danh mục' },
    { prop: 'status', name: 'Trạng thái' },
    { prop: 'imageUrlPath', name: 'Ảnh bài viết' },
  ];
  baseUrl: string = 'http://localhost:8081';
  categories = [{ categoryId: 1, name: 'Category 1' }];
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.addPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      categoryId: ['', Validators.required],
      status: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    
    this.editPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      categoryId: ['', Validators.required],
      status: ['Available', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    
  }


  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.loadPosts();
        this.loadCategories();
      }
    });
  }

  addPost() {
    if (this.addPostForm.valid  && this.userId) {
      const postData = this.addPostForm.value;
      postData.categoryId = +postData.categoryId;
      postData.createdBy = this.userId;

      const formData = new FormData();
      formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      this.apiService.postFormData(ConstService.AddPost, formData).subscribe(
        (response) => {
          this.notificationService.success('Thêm bài viết thành công.');
          this.loadPosts();
          this.addPostForm.reset();
          const modalCloseButton = document.querySelector('#exampleModalAddPost .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm bài viết.');
        }
      );
    } else {
      Object.keys(this.addPostForm.controls).forEach((key) => {
        const control = this.addPostForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onEditFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedEditFile = file;
    }
  }

  loadCategories(): void {
    this.apiService.get(`${ConstService.GetAllCategory}`).subscribe(
      (data) => {
        const parentCategory = data.find((category: { name: string; }) => category.name === 'tin tức');
        if (parentCategory) {
          this.categories = data.filter((category: { parentId: any; }) => category.parentId === parentCategory.categoryId);
        } else {
          this.categories = [];
        }
        console.log(this.categories);
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }

  loadPosts(): void {
    this.apiService.get(`${ConstService.GetAllPost}`).subscribe(
      (data) => {
        this.allPosts = data;
        this.totalItems = this.allPosts;
        this.filteredPosts = this.allPosts.slice(this.offset);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${this.baseUrl}${imageUrl}`;
  }

  openEditModal(post: any): void {
    this.currentPostId = post.postId;

    // Chuyển đổi từ định dạng ISO 8601 sang yyyy-MM-dd
    const fromDateFormatted = this.convertIsoToDate(post.fromDate);
    const toDateFormatted = this.convertIsoToDate(post.toDate);

    this.editPostForm.setValue({
        title: post.title,
        content: post.content,
        categoryId: post.categoryId,
        status: post.status,
        fromDate: fromDateFormatted,
        toDate: toDateFormatted,
    });
}

// Helper function to convert ISO date to yyyy-MM-dd
convertIsoToDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


  updatePost(postId: number): void {
    if (this.editPostForm.valid) {
      const postData = this.editPostForm.value;
      postData.categoryId = +postData.categoryId;

      const formData = new FormData();
      formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

      if (this.selectedEditFile) {
        formData.append('file', this.selectedEditFile, this.selectedEditFile.name);
      }

      this.apiService.putFormData(ConstService.UpdatePost + postId, formData).subscribe(
        (response) => {
          this.notificationService.success('Cập nhật bài viết thành công.');
          this.loadPosts();
          this.editPostForm.reset();
          const modalCloseButton = document.querySelector('#exampleModalEditPost .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi cập nhật bài viết.');
        }
      );
    } else {
      Object.keys(this.editPostForm.controls).forEach((key) => {
        const control = this.editPostForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  deletePost(postId: number): void {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Bạn sẽ không thể khôi phục lại dữ liệu này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, xóa nó!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
        .delete(`${ConstService.DeletePost}/${postId}`).subscribe(
          (response) => {
            this.notificationService.success('Xóa bài viết thành công.');
            this.loadPosts();
          },
          (error) => {
            this.notificationService.error('Có lỗi xảy ra khi xóa bài viết.');
          }
        );
      }
    });
  }

  updateFilter(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredPosts = this.allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(value) ||
        this.getCategoryName(post.categoryId).toLowerCase().includes(value)
    );
    this.totalItems = this.filteredPosts;
    this.offset = 0;
    this.filteredPosts = this.filteredPosts.slice(this.offset);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.categoryId === categoryId);
    return category ? category.name : 'Unknown';
  }

  onPage(event: any): void {
    this.offset = event.offset;
  }

  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  };
}