import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  isDoctor: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe((res: any) => {
      this.user = res;

      // this.authService.user.next(res);
    });
  }

  logout() {
    const model = {};
    this.authService.login(model).subscribe((res: any) => {
      this.user = null;
      this.authService.user.next(res);
    });
  }
}
