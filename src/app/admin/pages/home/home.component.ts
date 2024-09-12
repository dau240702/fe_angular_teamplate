import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';

interface CategoryCount {
  total: number;
  products: { name: string; quantity: number }[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalProducts: number = 0;
  totalContacts: number = 0;
  totalPosts: number = 0;
  products: any[] = [];
  categoryCounts: { [key: string]: { total: number, products: any[] } } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProduct();
    this.loadContacts();
    this.loadPosts();
  }

  loadProduct(): void {
    this.apiService.get(ConstService.GetAllProduct).subscribe(
      (data) => {
        this.products = data;
        this.totalProducts = this.products.length;
        this.calculateCategoryCounts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  loadContacts(): void {
    this.apiService.get(ConstService.GetAllcontacts).subscribe(
      (data) => {
        this.totalContacts = data.length;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  loadPosts(): void {
    this.apiService.get(ConstService.GetAllPost).subscribe(
      (data) => {
        this.totalPosts = data.length;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  calculateCategoryCounts(): void {
    this.categoryCounts = this.products.reduce((counts, product) => {
      const categoryName = product.categoryName;
      if (!counts[categoryName]) {
        counts[categoryName] = {
          total: 0,
          products: []
        };
      }
      counts[categoryName].total += product.stockQuantity;
      counts[categoryName].products.push({
        name: product.name,
        quantity: product.stockQuantity
      });
      return counts;
    }, {} as { [key: string]: { total: number, products: any[] } });
  }
}