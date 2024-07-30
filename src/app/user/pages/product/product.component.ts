import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { ProductDTO } from '../../../../model/product-dto'
import{Category} from '../../../../model/category.model'
import { ConstService } from '../../../../service/const.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: { [key: string]: any[] } = {};
  activeCategory: string = '';
  childCategories: any[] = []; // Thêm thuộc tính lưu các category con
  baseUrl: string = 'http://localhost:8081'; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.apiService.get(ConstService.GetAllCategory).subscribe(
      (data) => {
        this.categories = data;
        this.filterProducts();
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadProducts(): void {
    this.apiService.get(ConstService.GetAllProduct).subscribe(
      (data) => {
        this.products = data;
        this.filterProducts();
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return ''; // Trả về chuỗi rỗng nếu không có đường dẫn
    return `${this.baseUrl}${imagePath}`;
  }

  private filterProducts() {
    const parentCategoryId = this.categories.find(c => c.name === 'sản phẩm')?.categoryId;
    
    if (parentCategoryId !== undefined) {
      this.childCategories = this.categories.filter(c => c.parentId === parentCategoryId);
      this.filteredProducts = {};

      this.childCategories.forEach(category => {
        this.filteredProducts[category.name] = this.products.filter(product => product.categoryId === category.categoryId);
      });

      this.activeCategory = this.childCategories.length > 0 ? this.childCategories[0].name : '';
    }
  }

  setActiveCategory(categoryName: string): void {
    this.activeCategory = categoryName;
  }
}
