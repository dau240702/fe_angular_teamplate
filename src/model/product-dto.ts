export interface ProductDTO {

  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  status: string;
  createdBy: number; // Thêm thuộc tính này
  imageUrl: string;

}
