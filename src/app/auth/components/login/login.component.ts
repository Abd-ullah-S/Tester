import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  users: any[] = [];
  type: string = 'students';
  constructor(
    private fb: FormBuilder,
    private authserv: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getUsers();
  }

  createForm() {
    this.loginForm = this.fb.group({
      type: [this.type],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });
  }
  getRole(event: any) {
    this.type = event.value;
    this.getUsers();
  }
  getUsers() {
    this.authserv.getUser(this.type).subscribe((res: any) => {
      this.users = res;
    });
  }

  login() {
    // Find user by email and password
    const index = this.users.findIndex(
      (user) =>
        user.email == this.loginForm.value.email &&
        user.password == this.loginForm.value.password
    );

    if (index == -1) {
      this.toastr.error('الايميل أو كلمة المرور خطأ', '', {
        disableTimeOut: false,
        titleClass: 'toastr-title',
        messageClass: 'toastr-message',
        timeOut: 2000,
        closeButton: true,
      });
      return;
    }

    // Get matched user
    const user = this.users[index];

    // Create login model
    const model = {
      userName: user.userName,
      user_id: user.id,
      role: this.type, // assuming type is 'student' or 'doctor'
    };

    // Call auth service
    this.authserv.login(model).subscribe({
      next: (res) => {
        this.authserv.user.next(user); // Update user in auth service
        this.toastr.success('تم التسجيل بنجاح', '', {
          disableTimeOut: false,
          titleClass: 'toastr-title',
          messageClass: 'toastr-message',
          timeOut: 2000,
          closeButton: true,
        });
        this.router.navigate(['/subjects']);
      },
      error: (err) => {
        console.log('Login error details:', err); // Added error logging
        this.toastr.error('حدث خطأ في تسجيل الدخول', '', {
          timeOut: 2000,
          closeButton: true,
        });
      },
    });
  }
}
