export interface PostDTO {
    postId: number;
    title: string;
    content: string;
    categoryId: number;
    status: string;
    createdBy: number; 
    imageUrl: string;
  }