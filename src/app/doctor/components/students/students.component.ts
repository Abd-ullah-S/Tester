import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  dataSource: any;
  displayedColumns: any;
  datatable: any;
  constructor(private authService: AuthService) {
    this.displayedColumns = ['position', 'userName', 'subjectName', 'score'];
    this.getStudents();
  }

  ngOnInit(): void {}

  getStudents() {
    this.authService.getUser('students').subscribe((res: any) => {
      this.dataSource = res?.map((student: any) => {
        if (student?.subjects) {
          return student?.subjects?.map((sub: any) => {
            return {
              userName: student.userName,
              subjectName: sub.subjectName,
              score: sub.score,
            };
          });
        } else {
          return [
            {
              userName: student.userName,
              subjectName: '--',
              score: '--',
            },
          ];
        }
      });
      console.log('this.dataSource', this.dataSource);
      this.datatable = [];
      this.dataSource.forEach((item: any) => {
        item.forEach((subItem: any) => {
          this.datatable.push({
            userName: subItem.userName,
            subjectName: subItem.subjectName,
            score: subItem.score,
          });
        });
      });
    });
  }
}
