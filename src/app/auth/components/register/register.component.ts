import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  userform!: FormGroup;
  students: any[] = [];
  constructor(
    private fb: FormBuilder,
    private authserv: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getStudents();
  }
  createForm() {
    this.userform = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  getStudents() {
    this.authserv.getUser('students').subscribe((res: any) => {
      this.students = res;
    });
  }
  submit() {
    const model = {
      userName: this.userform.value.userName,
      email: this.userform.value.email,
      password: this.userform.value.password,
    };
    let index = this.students.findIndex((item) => item.email === model.email);
    if (index !== -1) {
      this.toastr.error('الحساب موجود بالفعل', '', {
        disableTimeOut: false,
        titleClass: 'toastr-title',
        messageClass: 'toastr-message',
        timeOut: 2000,
        closeButton: true,
      });
    } else {
      this.authserv.createUser(model).subscribe((res: any) => {
        this.toastr.success('تم انشاء الحساب بنجاح', '', {
          disableTimeOut: false,
          titleClass: 'toastr-title',
          messageClass: 'toastr-message',
          timeOut: 2000,
          closeButton: true,
        });
        const loginModel = {
          userName: res.userName,
          user_id: res.id,
          role: ['students'], // assuming type is 'student' or 'doctor'
        };

        // Call auth service
        this.authserv.login(loginModel).subscribe({
          next: (loginRes) => {
            this.authserv.user.next(loginRes); // Update user in auth service
            this.router.navigate(['/subjects']);
          },
        });
      });
    }
  }
}
