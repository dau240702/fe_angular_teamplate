import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private http: HttpClient) {}
  public static serverHost(): string {
    return isDevMode() ? 'http://localhost:8081' : '';

  }

  public static readonly FREQUENCY = {};
  // auth
  public static Authention = 'auth';
  public static GetUsername = 'auth/users';
  
  // category
  public static GetAllCategory = 'categories/all';
  public static AddCategory = 'categories';
  public static UpdateCategory = 'categories/update';
  public static DeleteCategory = 'categories/delete';

  // product
  public static GetAllProduct = 'product/all';
  public static AddProduct = 'product';
  public static UpdateProduct = 'product/update/';
  public static DeleteProduct = 'product/delete';

  // product
  public static GetAllPost = 'post/all';
  public static AddPost = 'post';
  public static UpdatePost = 'post/update/';
  public static DeletePost = 'post/delete';

  // contact
  public static GetAllcontacts = 'contacts';
  public static Addcontacts = 'contacts';
}