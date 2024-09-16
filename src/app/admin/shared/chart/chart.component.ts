import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
  @Input() categoryCounts: { [key: string]: { total: number, products: any[] } } = {};
  @Input() chartLabel: string = '';
  chart: Chart | undefined;

  constructor() { 
    Chart.register(...registerables); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryCounts'] && Object.keys(this.categoryCounts).length > 0) {
      this.createChart();
    }
  }

  createChart(): void {
    const categoryLabels = Object.keys(this.categoryCounts);
    const productCounts = categoryLabels.map(label => this.categoryCounts[label].total);

    const defaultColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)'
    ];

    const generateRandomColor = () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`;
    const backgroundColors = categoryLabels.map((_, index) =>
      index < defaultColors.length ? defaultColors[index] : generateRandomColor()
    );

    const borderColors = categoryLabels.map((_, index) =>
      index < defaultColors.length ? defaultColors[index].replace('0.2', '1') : generateRandomColor().replace('0.2', '1')
    );

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: categoryLabels,
        datasets: [{
          label: this.chartLabel,
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
