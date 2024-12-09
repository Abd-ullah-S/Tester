import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss'],
})
export class NewExamComponent implements OnInit {
  name = new FormControl();
  questionForm!: FormGroup;
  questions: any[] = [];
  correctAns: any;
  id: any;
  stepIndex: number = 0;
  startQuiz: boolean = false;
  preview: boolean = false;
  subjectName: string = '';
  editingIndex: number | undefined;

  constructor(
    private formBuild: FormBuilder,
    private toastr: ToastrService,
    private docsev: DoctorService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.questionForm = this.formBuild.group({
      question: ['', [Validators.required]],
      answer1: ['', [Validators.required]],
      answer2: ['', [Validators.required]],
      answer3: ['', [Validators.required]],
      answer4: ['', [Validators.required]],
      correctAnswer: [''],
    });
  }
  addQuestion() {
    if (!this.correctAns) {
      this.toastr.error('يرجي اختيار الاجابة الصحيحة');
      return;
    }

    if (this.questionForm.invalid) {
      this.toastr.error('يرجي ملء جميع الحقول المطلوبة');
      return;
    }

    const model = {
      question: this.questionForm.value.question,
      answer1: this.questionForm.value.answer1,
      answer2: this.questionForm.value.answer2,
      answer3: this.questionForm.value.answer3,
      answer4: this.questionForm.value.answer4,
      correctAnswer: this.questionForm.value[this.correctAns],
    };

    if (!this.questions) {
      this.questions = [];
    }

    if (this.editingIndex !== undefined) {
      this.questions[this.editingIndex] = model;
      this.editingIndex = undefined;
      this.toastr.success('تم تعديل السؤال بنجاح');
    } else {
      this.questions.push(model);
      this.toastr.success('تمت اضافة السؤال بنجاح');
    }

    this.questionForm.reset();
    console.log(this.questions);
  }
  getCorrect(event: any) {
    this.correctAns = event.value;
  }
  start() {
    if (this.name.value === null || this.name.value === '') {
      this.toastr.error('يرجي كتابة اسم المادة');
      return;
    } else {
      this.subjectName = this.name.value;
      this.stepIndex = 1;
      this.startQuiz = true;
    }
  }
  clear() {
    this.questionForm.reset();
  }
  back() {
    this.questionForm.reset();
    this.questions = [];
    this.subjectName = '';
    this.name.reset();
    this.stepIndex = 0;
    this.startQuiz = false;
  }
  submit(): void {
    const model = {
      name: this.subjectName,
      questions: this.questions,
    };
    if (this.preview) {
      this.stepIndex = 2;
    } else {
      this.docsev.createSubject(model).subscribe((res: any) => {
        this.preview = true;
        this.id = res.id;
        this.toastr.success('تم اضافة الامتحان بنجاح');
      });
    }
  }

  delete(index: number) {
    this.questions.splice(index, 1);
    const model = {
      name: this.subjectName,
      questions: this.questions,
    };
    this.docsev.updateSubject(model, this.id).subscribe((res: any) => {
      this.toastr.success('تم حذف السؤال بنجاح');
    });
  }

  /*   editQuestion(index: number) {
    const question = this.questions[index];
    this.questionForm.setValue({
      question: question.question,
      answer1: question.answer1,
      answer2: question.answer2,
      answer3: question.answer3,
      answer4: question.answer4,
      correctAnswer: question.correctAnswer,
    });

    this.delete(index); // Remove the old question before updating

    this.addQuestion(); // Add the updated question

    const model = {
      name: this.subjectName,
      questions: this.questions,
    };

    this.docsev.updateSubject(model, this.id).subscribe(() => {
      this.toastr.success('تم تعديل السؤال بنجاح');
      this.stepIndex = 1;
    });
  } */
  editQuestion(index: number): void {
    const question = this.questions[index];
    this.questionForm.patchValue({
      question: question.question,
      answer1: question.answer1,
      answer2: question.answer2,
      answer3: question.answer3,
      answer4: question.answer4,
      correctAnswer: question.correctAnswer,
    });
    this.editingIndex = index;
  }
}
