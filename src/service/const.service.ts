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

  // post
  public static GetAllPost = 'post/all';
  public static GetPostId = 'post';
  public static AddPost = 'post';
  public static UpdatePost = 'post/update/';
  public static DeletePost = 'post/delete';
  public static ViewcountPost = 'post';

  // contact
  public static GetAllcontacts = 'contacts';
  public static Addcontacts = 'contacts';
  public static Deletecontacts = 'contacts/delete';


  // comment
  public static GetAllCommentsByPostId = 'comments/post';
  public static GetCommentById = 'comments';
  public static AddComment = 'comments';
  public static UpdateComment = 'comments/update/';
  public static DeleteComment = 'comments/delete/'; 

    // sendmail
    public static GetAllMail = 'email/all';
    public static PostMail = 'email/send';

    public static DeleteMail = 'email/delete';

  // Booking
  public static GetAllbookings = 'bookings';
  public static Addbookings = 'bookings';
  public static Deletebookings = 'bookings/delete';

}