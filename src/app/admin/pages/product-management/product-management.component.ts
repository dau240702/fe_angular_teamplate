import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { UserService } from '../../../../service/user.service';
import { ConstService } from '../../../../service/const.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductDTO } from '../../../../model/product-dto';
import { NotificationService } from '../../../../service/Notification/notification.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  Allproduct: ProductDTO[] = [];
  userId: number | null = null;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  filteredProduct: ProductDTO[] = [];
  totalItems: ProductDTO[] = [];
  offset = 0;
  currentProductId: number | null = null;
  columns = [
    { prop: 'name', name: 'Tên sản phẩm' },
    { prop: 'categoryId', name: 'Loại sản phẩm' },
    { prop: 'price', name: 'Giá sản phẩm' },
    { prop: 'stockQuantity', name: 'Số lượng' },
    { prop: 'status', name: 'Trạng thái' },
    { prop: 'imageUrl', name: 'Ảnh sản phẩm' },
  ];
  baseUrl: string = 'http://localhost:8081';
  categories = [{ categoryId: 1, name: 'Category 1' }];
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;

  imageSrc!: string;
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      categoryId: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      categoryId: ['', Validators.required],
      status: ['Available', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.loadProduct();
        this.loadCategories();
      }
    });
  }
  addProduct() {
    if (this.addProductForm.valid && this.userId) {
      const productData = this.addProductForm.value;
      productData.categoryId = +productData.categoryId;
      productData.createdBy = this.userId;

      const formData = new FormData();
      formData.append(
        'product',
        new Blob([JSON.stringify(productData)], { type: 'application/json' })
      );

      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      this.apiService.postFormData(ConstService.AddProduct, formData).subscribe(
        (response) => {
          this.notificationService.success('Thêm sản phẩm thành công.');
          this.loadProduct();
          this.addProductForm.reset();
          const modalCloseButton = document.querySelector(
            '#exampleModaladd .btn-close'
          ) as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
        }
      );
    } else {
      Object.keys(this.addProductForm.controls).forEach((key) => {
        const control = this.addProductForm.get(key);
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
        const parentCategory = data.find((category: { name: string; }) => category.name === 'sản phẩm');
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

  loadProduct() {
    this.apiService.get(`${ConstService.GetAllProduct}`).subscribe(
      (data) => {
        this.Allproduct = data;
        this.totalItems = this.Allproduct;
        this.filteredProduct = this.Allproduct.slice(this.offset);
      },
      (error) => {
        console.error('Error fetching Product:', error);
      }
    );
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${this.baseUrl}${imageUrl}`;
  }

  openEditModal(product: any): void {
    this.currentProductId = product.productId;
    this.editProductForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      status: product.status,
    });
  }

  onPage(event: any) {
    this.offset = event.offset;
  }

  deleteProduct(productId: number) {
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
          .delete(`${ConstService.DeleteProduct}/${productId}`)
          .subscribe(
            (response) => {
              this.notificationService.success('Xóa sản phẩm thành công.');
              this.loadProduct();
            },
            (error) => {
              this.notificationService.error('Có lỗi xảy ra khi xóa sản phẩm.');
            }
          );
      }
    });
  }

  updateFilter(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredProduct = this.Allproduct.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        this.getCategoryName(product.categoryId).toLowerCase().includes(value)
    );
    this.totalItems = this.filteredProduct;
    this.offset = 0;
    this.filteredProduct = this.filteredProduct.slice(this.offset);
  }

  updateProduct(productId: number): void  {
    if (this.editProductForm.valid) {
      const productData = this.editProductForm.value;
      productData.categoryId = +productData.categoryId;

      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(productData)], {type: 'application/json'}));
      
      if (this.selectedEditFile) {
        formData.append('file', this.selectedEditFile, this.selectedEditFile.name);
      }
      // this.apiService.postFormData(ConstService.AddProduct, formData).subscribe(

      this.apiService.putFormData(ConstService.UpdateProduct + productId, formData).subscribe(
        (response) => {
          this.notificationService.success('Cập nhật sản phẩm thành công.');
          this.loadProduct();
          this.editProductForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaledit .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi cập nhật sản phẩm.');
        }
      );
    } else {
      Object.keys(this.editProductForm.controls).forEach((key) => {
        const control = this.editProductForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.categoryId === categoryId);
    return category ? category.name : 'Unknown';
  }
  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  };
}