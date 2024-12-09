import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  role: any;
  constructor(private docServ: DoctorService, private authServ: AuthService) {}
  subjects: any[] = [];
  user: any = {};

  ngOnInit(): void {
    this.getSubjects();
    this.getRole();
  }

  getSubjects(): void {
    this.docServ.getSubjects().subscribe((res: any) => {
      this.subjects = res;
    });
  }

  getRole() {
    this.authServ.getRole().subscribe((res: any) => {
      this.user = res;
    });
  }
  deleteSubject(id: any) {
    this.docServ.deleteSubject(id).subscribe((res: any) => {
      this.getSubjects();
    });
  }
  showSubject(id: any) {
    this.docServ.showSubject(id).subscribe((res: any) => {
      console.log(res);
    });
  }
}
