import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { UserService } from '../../../../service/user.service';
import { ConstService } from '../../../../service/const.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductDTO } from '../../../../model/product-dto';

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
  totalItems : ProductDTO[] = [];
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
  notificationService: any;
  categories = [{ categoryId: 1, name: 'Category 1' }];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      imageUrl: [''],
      categoryId: [undefined, Validators.required],
      status: ['Available', Validators.required],
    });
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      imageUrl: [''],
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

  loadCategories(): void {
    this.apiService.get(`${ConstService.GetAllCategory}`).subscribe(
      (data) => {
        this.categories = data;
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
        this.totalItems = this.Allproduct; // Cập nhật tổng số sản phẩm
        this.filteredProduct = this.Allproduct.slice(
          this.offset,
        ); // Cập nhật sản phẩm theo phân trang
      },
      (error) => {
        console.error('Error fetching Product:', error);
      }
    );
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return ''; // Trả về chuỗi rỗng nếu không có đường dẫn
    return `${this.baseUrl}${imagePath}`;
  }

  openEditModal(product: any) {
    this.currentProductId = product.productId;
    this.editProductForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      status: product.status,
    });
  }

  addProduct(): void {
    if (this.addProductForm && this.addProductForm.valid && this.userId) {
      const formValue = this.addProductForm.value;
      const productData: Partial<ProductDTO> = {
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        stockQuantity: formValue.stockQuantity,
        imageUrl: formValue.imageUrl,
        categoryId: Number(formValue.categoryId),
        status: formValue.status,
        createdBy: this.userId,
      };
      this.apiService.post(ConstService.AddProduct, productData).subscribe(
        (response: ProductDTO) => {
          this.notificationService.success('Thêm sản phẩm thành công.');
          this.addProductForm?.reset();
          const modalCloseButton = document.querySelector(
            '#exampleModaladd .btn-close'
          ) as HTMLElement;
          modalCloseButton?.click();
          this.loadProduct();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
          console.error('Error adding product:', error);
        }
      );
    } else {
      console.log('Form is invalid');
      this.notificationService.error(
        'Vui lòng điền đầy đủ thông tin sản phẩm.'
      );
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.addProductForm.patchValue({
      imageUrl: file
    });
  }
  onPage(event: any) {
    this.offset = event.offset;
    this.filteredProduct = this.Allproduct.slice(
      this.offset,
    );
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
          .delete(`${ConstService.DeleteProduct}/${productId}`)
          .subscribe(
            (response) => {
              Swal.fire('Đã xóa!', '', 'success');
              this.loadProduct();
            },
            (error) => {
              Swal.fire('Có lỗi xảy ra!', '', 'error');
              console.error('Error deleting product:', error);
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
    this.offset = 0; // Reset offset khi tìm kiếm
    this.filteredProduct = this.filteredProduct.slice(
      this.offset,
    ); // Cập nhật sản phẩm theo phân trang
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.categoryId === categoryId);
    return category ? category.name : 'Unknown';
  }
  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  };
}