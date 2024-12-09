import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new Subject();
  constructor(private http: HttpClient) {}
  createUser(model: any) {
    return this.http.post(`${environment.APIURl}/students`, model);
  }
  login(model: any) {
    return this.http.put(`${environment.APIURl}/login/1`, model);
  }
  getUser(type: string) {
    return this.http.get(environment.APIURl + '/' + type);
  }
  getStudent(id: string) {
    return this.http.get(environment.APIURl + '/students' + '/' + id);
  }
  updateStudent(id: string, model: any) {
    return this.http.put(`${environment.APIURl}/students/${id}`, model);
  }
  getRole() {
    // return this.http.get(environment.APIURl + '/login/1');
    return this.http.get(`${environment.APIURl}/login/1`);
  }
}
