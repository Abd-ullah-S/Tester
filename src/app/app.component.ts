import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.authService.getRole().subscribe((res: any) => {
      this.authService.user.next(res);
    });
  }
}
