import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { ContactDTO } from '../../../../model/ContactDTO';
import { ApiService } from '../../../../service/api/api.service';
import { UserService } from '../../../../service/user.service';
import { ConstService } from '../../../../service/const.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private userService: UserService,

    private notificationService: NotificationService // Nếu có dịch vụ thông báo
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const contactData: ContactDTO = this.contactForm.value;

      this.apiService.post(ConstService.Addcontacts, contactData).subscribe(
        (response:ContactDTO) => {
          this.notificationService.success('Liên hệ của bạn đã được gửi thành công.'); // Thông báo thành công
          this.contactForm.reset();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi gửi liên hệ.'); // Thông báo lỗi
        }
      );
    }
  }
}