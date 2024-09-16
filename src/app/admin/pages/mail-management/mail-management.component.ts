import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import jQuery from 'jquery';
import 'select2';

import { HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ContactDTO } from '../../../../model/ContactDTO';
import { EmailLog } from '../../../../model/email.model';
import { ApiService } from '../../../../service/api/api.service';
import { ConstService } from '../../../../service/const.service';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { UserService } from '../../../../service/user.service';
@Component({
  selector: 'app-mail-management',
  templateUrl: './mail-management.component.html',
  styleUrls: ['./mail-management.component.css']
})
export class MailManagementComponent implements OnInit,AfterViewInit  {

  userId: number | null = null;
  addCategoryForm: FormGroup;
  emailLogs: EmailLog[] = [];
  filteredCategories: EmailLog[] = [];

  filteredContact: ContactDTO[] = [];

  offset = 0;
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private notificationService: NotificationService,
    private renderer: Renderer2, private el: ElementRef,
    private fb: FormBuilder,
    private formBuilder: FormBuilder
    
  ) {
    this.addCategoryForm = this.formBuilder.group({
      toEmails: [[]], 
      subject: [''],
      body: ['']
    });
  }
  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.userId$.subscribe((userId) => {
      if (!this.userId && userId) {
        this.userId = userId;
        this.loadEmails();
        this.loadContacts();
      }
    });
  }
  loadContacts() {
    this.apiService.get(ConstService.GetAllcontacts).subscribe(
      (response: any[]) => {
        this.filteredContact = response;
        this.initializeSelect2();
      },
      (error) => {
        this.notificationService.error('Có lỗi xảy ra khi tải danh sách email.');
      }
    );
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredCategories = this.emailLogs.filter(email => {
      return email.subject.toLowerCase().includes(val) || email.body.toLowerCase().includes(val);
    });
  }

  onPage(event: any) {
    this.offset = event.offset;
  }
  sendEmail() {
    const formValue = this.addCategoryForm.value;
    const emailRequest = {
      toEmails: formValue.toEmails,
      subject: formValue.subject,
      body: formValue.body
    };

    if (!emailRequest.toEmails || emailRequest.toEmails.length === 0) {
      this.notificationService.error('Vui lòng chọn ít nhất một địa chỉ email người nhận.');
      return;
    }

    this.apiService.postText(`${ConstService.PostMail}`, emailRequest)
      .pipe(
        tap((response: string) => {
          console.log('Server response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error details:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (response: string) => {
          this.notificationService.success(response || 'Gửi mail thành công.');
          this.loadEmails();
          this.addCategoryForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaladd .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            this.notificationService.error(`Lỗi: ${error.error.message}`);
          } else {
            // Server-side error
            this.notificationService.error(`Mã lỗi: ${error.status}, Nội dung: ${error.error}`);
          }
        }
      );
  }



  initializeSelect2() {
    jQuery(document).ready(() => {
      jQuery('.select2-multiple').select2({
        placeholder: 'Chọn email người nhận',
        allowClear: true,
        closeOnSelect: false,
        minimumResultsForSearch: Infinity,
        dropdownAutoWidth: true
      });

      jQuery('.select2-multiple').on('select2:select select2:unselect', (e: any) => {
        const selectedEmails = jQuery('.select2-multiple').val() as string[];
        this.addCategoryForm.controls['toEmails'].setValue(selectedEmails);
      });
    });
  }
  

  // Hàm tải tất cả email từ server
  loadEmails() {
    this.apiService.get(`${ConstService.GetAllMail}`).subscribe(
      (emails: EmailLog[]) => {
        this.emailLogs = emails;
        this.filteredCategories = [...this.emailLogs];
      },
      (error) => {
        this.notificationService.error('Có lỗi xảy ra khi tải trang.');
      }
    );
  }

  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  }
}
