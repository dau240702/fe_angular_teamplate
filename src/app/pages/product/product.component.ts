import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products = [
    { id: '1', name: 'Product 2' },
    { id: '2', name: 'Product 4' },
    { id: '3', name: 'Product 6' },
    // Thêm các sản phẩm khác nếu cần
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
