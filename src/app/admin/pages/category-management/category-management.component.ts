import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';
import { UserService } from '../../../../service/user.service';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  categories: any[] = [];
  userId: number | null = null;
  addCategoryForm: FormGroup | undefined;
  editCategoryForm: FormGroup ;
  currentCategoryId: number | null = null;

  @ViewChild('editTemplate', { static: true }) editTemplate: any;
  @ViewChild('deleteTemplate', { static: true }) deleteTemplate: any;

  columns: any[] = [];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.editCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  addCategory() {
    if (this.addCategoryForm && this.addCategoryForm.valid) {
      const categoryData = this.addCategoryForm.value;
      this.apiService.post(ConstService.AddCategory, categoryData).subscribe(
        (response) => {
          this.notificationService.success('Thêm thể loại thành công.');
          this.categories.push(response);  // Cập nhật danh sách thể loại
          this.addCategoryForm?.reset();  // Reset form
          const modalCloseButton = document.querySelector('#exampleModaladd .btn-close') as HTMLElement;
          modalCloseButton?.click();  // Đóng modal
          this.loadCategories()
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm thể loại.');
        }
      );
    }
  }

  ngOnInit(): void {
    this.columns = [
      { prop: 'categoryId', name: 'ID' },
      { prop: 'name', name: 'Name' },
      { prop: 'description', name: 'Description' },
      { name: 'Edit', cellTemplate: this.editTemplate },
      { name: 'Delete', cellTemplate: this.deleteTemplate }
    ];

    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.loadCategories();
      }
    });
  }

  loadCategories() {
    this.apiService.get(`${ConstService.GetAllCategory}`).subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  openEditModal(category: any) {
    this.currentCategoryId = category.categoryId;
    this.editCategoryForm.setValue({
      name: category.name,
      description: category.description
    });
  }

  updateCategory() {
    if (this.editCategoryForm.valid) {
      const categoryData = this.editCategoryForm.value;
      this.apiService.put(`${ConstService.UpdateCategory}/${this.currentCategoryId}`, categoryData).subscribe(
        (response) => {
          this.notificationService.success('Chỉnh sửa thể loại thành công.');
          const index = this.categories.findIndex(category => category.categoryId === this.currentCategoryId);
          this.categories[index] = response;  // Cập nhật danh sách thể loại
          this.editCategoryForm.reset();  // Reset form
          const modalCloseButton = document.querySelector('#exampleModaledit .btn-close') as HTMLElement;
          modalCloseButton.click();  // Đóng modal
          this.loadCategories();

        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi chỉnh sửa thể loại.');
        }
      );
    }
  }

  deleteCategory(categoryId: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: "Bạn sẽ không thể khôi phục lại dữ liệu này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó đi!',
      cancelButtonText: 'Không, giữ nguyên'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(`${ConstService.DeleteCategory}/${categoryId}`).subscribe(
          () => {
            this.categories = this.categories.filter(category => category.categoryId !== categoryId);
            Swal.fire(
              'Đã xóa!',
              'Dữ liệu của bạn đã được xóa.',
              'success'
            );
          },
          (error) => {
            console.error('Error deleting category:', error);
            let errorMessage = 'Có lỗi xảy ra khi xóa dữ liệu.';

            if (error.status === 400 && error.error.message.includes('constraint')) {
              errorMessage = 'Bạn không thể xóa hàng này vì nó đang liên kết với dữ liệu khác.';
            }

            Swal.fire(
              'Lỗi!',
              errorMessage,
              'error'
            );
          }
        );
      }
    });
  }

  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  }
}

