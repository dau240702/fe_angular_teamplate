import { ContactDTO } from './../../../../model/ContactDTO';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api/api.service';
import { UserService } from '../../../../service/user.service';
import { ConstService } from '../../../../service/const.service';

import { NotificationService } from '../../../../service/Notification/notification.service';

@Component({
  selector: 'app-contact-management',
  templateUrl: './contact-management.component.html',
  styleUrl: './contact-management.component.css',
})
export class ContactManagementComponent implements OnInit {
  userId: number | null = null;
  offset = 0;
  filteredCategories: ContactDTO[] = [];
  contact: ContactDTO[] = [
    { categoryId: 1, name: '', email: '', phone: '', title: '', content: '' },
  ];
  columns = [
    { prop: 'categoryId', name: 'ID' },
    { prop: 'name', name: 'Tên khách hàng' },
    { prop: 'email', name: 'Email' },
    { prop: 'phone', name: 'Số điện thoại' },
    { prop: 'title', name: 'Tiêu đề' },
    { prop: 'content', name: 'Nội dung' },
  ];
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.loadcontacts();
      }
    });
  }
  isParentCategory(categoryName: string): boolean {
    return categoryName === 'sản phẩm' || categoryName === 'tin tức';
  }

  loadcontacts() {
    this.apiService.get(ConstService.GetAllcontacts).subscribe(
      (response) => {
        this.filteredCategories = response;
      },
      (error) => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách thể loại cha.'
        );
      }
    );
  }
  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  };
  onPage(event: any) {
    this.offset = event.offset;
  }
  updateFilter(event?: any) {
    const val = event ? event.target.value.toLowerCase() : '';
    this.filteredCategories = this.contact.filter((Contact) => {
      return (
        Contact.name.toLowerCase().includes(val) ||
        Contact.title.toLowerCase().includes(val)
      );
    });
  }
}