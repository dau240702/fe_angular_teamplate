import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';
import { UserService } from '../../../../service/user.service';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../model/category.model';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  userId: number | null = null;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  currentCategoryId: number | null = null;
  categories: Category[] = [
    { categoryId: 1, name: 'Category 1', description: '', parentId: undefined },
  ];
  filteredCategories: Category[] = [];
  parentCategories: Category[] = [];
  @ViewChild('editTemplate', { static: true }) editTemplate: any;
  @ViewChild('deleteTemplate', { static: true }) deleteTemplate: any;
  columns = [
    { prop: 'categoryId', name: 'ID' },
    { prop: 'name', name: 'Tên thể loại' },
    { prop: 'description', name: 'Mô tả' },
    { prop: 'parentId', name: 'Thể loại cha' },
    { name: 'Edit' },
    { name: 'Delete' }
  ];
  offset = 0;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [undefined, Validators.required]
    });
    this.editCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [undefined, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.filteredCategories = this.categories;
        this.loadCategories();
        this.loadParentCategories();
      }
    });
  }

  updateFilter(event?: any) {
    const val = event ? event.target.value.toLowerCase() : '';
    this.filteredCategories = this.categories.filter(category => {
      return category.name.toLowerCase().includes(val) || category.description.toLowerCase().includes(val);
    });
  }

  onPage(event: any) {
    this.offset = event.offset;
  }

  addCategory() {
    if (this.addCategoryForm && this.addCategoryForm.valid) {
      const formValue = this.addCategoryForm.value;
      const categoryData: Partial<Category> = {
        name: formValue.name,
        description: formValue.description,
        parentId: formValue.categoryId
      };

      this.apiService.post(ConstService.AddCategory, categoryData).subscribe(
        (response: Category) => {
          this.notificationService.success('Thêm thể loại thành công.');
          this.loadCategories();
          this.addCategoryForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaladd .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm thể loại.');
        }
      );
    }
  }

  isParentCategory(categoryName: string): boolean {
    return categoryName === 'sản phẩm' || categoryName === 'tin tức';
  }

  loadParentCategories() {
    this.apiService.get(ConstService.GetAllCategory).subscribe(
      (response: Category[]) => {
        this.parentCategories = response.filter(category =>
          category.name === 'sản phẩm' || category.name === 'tin tức'
        );
      },
      (error) => {
        this.notificationService.error('Có lỗi xảy ra khi tải danh sách thể loại cha.');
      }
    );
  }

  getCategoryName(parentId: number | undefined): string {
    if (parentId === undefined) {
      return '';
    }
    const parentCategory = this.categories.find(cat => cat.categoryId === parentId);
    return parentCategory ? parentCategory.name : '';
  }

  loadCategories() {
    this.apiService.get(`${ConstService.GetAllCategory}`).subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.updateFilter();
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  openEditModal(category: Category) {
    if (!this.isParentCategory(category.name)) {
      this.currentCategoryId = category.categoryId;
      this.editCategoryForm.patchValue({
        name: category.name,
        description: category.description,
        categoryId: category.parentId
      });
    }
  }

  updateCategory() {
    if (this.editCategoryForm.valid && this.currentCategoryId) {
      const formValue = this.editCategoryForm.value;
      const categoryData: Partial<Category> = {
        name: formValue.name,
        description: formValue.description,
        parentId: formValue.categoryId
      };

      this.apiService.put(`${ConstService.UpdateCategory}/${this.currentCategoryId}`, categoryData).subscribe(
        (response: Category) => {
          this.notificationService.success('Chỉnh sửa thể loại thành công.');
          this.loadCategories();
          this.editCategoryForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaledit .btn-close') as HTMLElement;
          modalCloseButton?.click();
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
      confirmButtonText: 'Vâng, xóa nó!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(`${ConstService.DeleteCategory}/${categoryId}`).subscribe(
          (response) => {
            this.notificationService.success('Xóa thể loại thành công.');
            this.loadCategories();
          },
          (error) => {
            this.notificationService.error('Có lỗi xảy ra khi xóa thể loại.');
          }
        );
      }
    });
  }
  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  }
}