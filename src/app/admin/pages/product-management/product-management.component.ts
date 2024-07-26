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
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  Allproduct: any[] = [];
  userId: number | null = null;
  addProductForm: FormGroup | undefined;
  products: any[] = [];
  currentProductId: number | null = null;
  editProductForm: FormGroup ;

  columns = [
    { prop: 'categoryId', name: 'ID' },
    { prop: 'name', name: 'Name' },
    { prop: 'description', name: 'Description' },
    { prop: 'imageUrlPath', name: 'Image' }
  ];
  product: ProductDTO = new ProductDTO();

  baseUrl: string = 'http://localhost:8081'; // Giả sử Spring Boot chạy trên cổng 8080// Thay đổi nếu cần thiết
  notificationService: any;
  categories = [
    { categoryId: 1, name: 'Category 1' },
  ];
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private fb: FormBuilder



  ) {

    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      imageUrl: [''],
      categoryId: ['', Validators.required],
      status: ['Available', Validators.required]
    });

  }
  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.loadProduct();
        this.loadCategories();
        this.initializeForm(); // Khởi tạo form

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
      description: product.description
    });
  }
  initializeForm(): void {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      imageUrl: [''],
      categoryId: ['', Validators.required],
      status: ['Available', Validators.required]
    });
  }



  addProduct(): void {
    if (this.addProductForm?.valid && this.userId) {
      const product: ProductDTO = this.addProductForm.value;
      product.createdBy = this.userId; // Gán userId vào createdBy của productDTO
      product.categoryId = Number(product.categoryId);

      this.apiService.post(ConstService.AddProduct,product).subscribe(
        (response) => {
          this.notificationService.success('Thêm sản phẩm thành công.');
          this.addProductForm?.reset();  // Reset form
          const modalCloseButton = document.querySelector('#exampleModaladd .btn-close') as HTMLElement;
          modalCloseButton?.click();  // Đóng modal
          this.loadProduct(); // Load lại danh sách sản phẩm
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
          console.error('Error adding product:', error); // Log lỗi để kiểm tra
        }
      );
    } else {
      console.log('Form is invalid'); // Log form invalid để kiểm tra
      this.notificationService.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
    }
  }

 
    
  deleteproduct(productId: number) {
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
        this.apiService.delete(`${ConstService.DeleteProduct}/${productId}`).subscribe(
          () => {
            this.products = this.products.filter(product => product.productId !== productId);
            Swal.fire(
              'Đã xóa!',
              'Dữ liệu của bạn đã được xóa.',
              'success'
            );
            this.loadProduct();
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
}