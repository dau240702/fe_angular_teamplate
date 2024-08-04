import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalProducts: number = 0;
  totalContacts: number = 0;
  totalPosts: number = 0; // Giả sử bạn có một cách nào đó để lấy tổng số bài viết từ backend
  products: any[] = [];
  categoryCounts: { [key: string]: number } = {};
  chart: Chart | undefined;

  constructor(private apiService: ApiService) { 
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.loadProduct();
    this.loadContacts();
    this.loadPosts(); 
  }

  loadProduct(): void {
    this.apiService.get(ConstService.GetAllProduct).subscribe(
      (data) => {
        this.products = data;
        this.totalProducts = this.products.length; // Cập nhật tổng số sản phẩm
        this.calculateCategoryCounts();
        this.createChart();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  loadContacts(): void {
    this.apiService.get(ConstService.GetAllcontacts).subscribe(
      (data) => {
        this.totalContacts = data.length; // Cập nhật tổng số thông tin liên hệ
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  loadPosts(): void {
    // Giả sử bạn có một API để lấy số lượng bài viết, ví dụ:
    this.apiService.get(ConstService.GetAllPost).subscribe(
      (data) => {
        this.totalPosts = data.length; // Cập nhật tổng số bài viết
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  calculateCategoryCounts(): void {
    this.categoryCounts = this.products.reduce((counts, product) => {
      const categoryName = product.categoryName; // Sử dụng tên danh mục
      counts[categoryName] = (counts[categoryName] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  }

  createChart(): void {
    const categoryLabels = Object.keys(this.categoryCounts);
    const productCounts = Object.values(this.categoryCounts);
  
    // Tạo một danh sách màu sắc cho từng cột
    const generateRandomColor = () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`;
    const borderColors = categoryLabels.map(() => generateRandomColor());
    const backgroundColors = categoryLabels.map(() => generateRandomColor());
  
    if (this.chart) {
      this.chart.destroy(); 
    }
  
    this.chart = new Chart('reportsChart', {
      type: 'bar', 
      data: {
        labels: categoryLabels,
        datasets: [{
          label: 'Thống kê số lượng sản phẩm trong cửa hàng', 
          data: productCounts,
          backgroundColor: backgroundColors, 
          borderColor: borderColors, 
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
}