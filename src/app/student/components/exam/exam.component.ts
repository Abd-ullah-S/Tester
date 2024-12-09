import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  id: any;
  QuesNum: number = 0;
  score = -1;
  total = 0;
  choosenAnswer = '';
  user: any = {};
  subject: any = {};
  studentInfo: any;
  showScore: boolean = false;
  validExam: boolean = true;
  studentHistory: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private serv: DoctorService,
    private toastr: ToastrService,
    private authServ: AuthService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.showSubject();
    this.getRole();
  }

  ngOnInit(): void {}
  showSubject() {
    this.serv.showSubject(this.id).subscribe((res: any) => {
      this.subject = res;
      this.total = this.subject.questions.length;
    });
  }
  delete(index: number) {
    this.subject.questions.splice(index, 1);
    const model = {
      name: this.subject.name,
      questions: this.subject.questions,
    };
    this.serv.updateSubject(model, this.id).subscribe((res: any) => {
      this.toastr.success('تم حذف السؤال بنجاح');
    });
  }
  getRole() {
    this.authServ.getRole().subscribe((res: any) => {
      this.user = res;
      this.getStudentInfo();
    });
  }
  getStudentInfo() {
    this.authServ.getStudent(this.user.user_id).subscribe((res: any) => {
      this.studentInfo = res;
      this.studentHistory = res?.subjects || [];
      this.checkExam();
    });
  }
  checkAnswer(event: any) {
    this.QuesNum = event.source.name;
    this.subject.questions[this.QuesNum].choosenAnswer = event.source.value;
    // console.log(this.subject.questions);
  }
  checkExam() {
    for (let x in this.studentHistory) {
      if (this.studentHistory[x].id == this.id) {
        this.validExam = false;
        this.score = this.studentHistory[x].score;
        this.showScore = true;
        this.toastr.success('لقد اجتزت هذا الامتحان مسبقا', '', {
          timeOut: 1000,
        });
        return;
      }
    }
  }
  getResults() {
    this.score = 0;
    this.subject.questions.forEach((element: any) => {
      if (element.choosenAnswer == element.correctAnswer) {
        this.score++;
      }
    });
    this.studentHistory.push({
      subjectName: this.subject.name,
      score: this.score,
      id: this.id,
    });
    this.showScore = true;
    const model = {
      userName: this.studentInfo.userName,
      email: this.studentInfo.email,
      password: this.studentInfo.password,
      subjects: this.studentHistory,
    };
    this.authServ.updateStudent(this.user.user_id, model).subscribe((res) => {
      this.toastr.success('تم تسجيل الدرجة بنجاح');
    });
  }
}
