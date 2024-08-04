import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';
import { Chart, registerables } from 'chart.js';

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
  total: number | undefined;
  totalProducts: number = 0;
  totalContacts: number = 0;
  totalPosts: number = 0;
  products: any[] = [];
  categoryCounts: { [key: string]: CategoryCount } = {};
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
        this.totalProducts = this.products.length;
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
    }, {} as { [key: string]: CategoryCount });
  }

  createChart(): void {
    const categoryLabels = Object.keys(this.categoryCounts);
    const productCounts = categoryLabels.map(label => this.categoryCounts[label].total);
  
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
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterBody: (context) => {
                const categoryName = context[0].label as string;
                const products = this.categoryCounts[categoryName].products;
                return products.map(p => `${p.name}: ${p.quantity}`).join('\n');
              }
            }
          }
        }
      }
    });
  }
}