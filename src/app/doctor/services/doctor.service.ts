import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  createSubject(model: any) {
    return this.http.post(environment.APIURl + '/subjects', model);
  }
  updateSubject(model: any, id: any) {
    return this.http.put(environment.APIURl + '/subjects/' + id, model);
  }
  getSubjects() {
    return this.http.get(environment.APIURl + '/subjects');
  }
  deleteSubject(id: any) {
    return this.http.delete(environment.APIURl + '/subjects/' + id);
  }
  showSubject(id: any) {
    return this.http.get(environment.APIURl + '/subjects/' + id);
  }
  
}
