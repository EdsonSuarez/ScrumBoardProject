import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private env: String;

  constructor(private http: HttpClient) {
    this.env = environment.APP_URL;
  }

  registerAdmin(user: any) {
    return this.http.post<any>(this.env + 'user/registerAdmin', user);
  }

  listUsers() {
    return this.http.get<any>(this.env + 'user/listUsers');
  }

  getUser(id: String) {
    return this.http.get<any>(this.env + `user/getUser/${id}`);
  }

  updateUser(user: any) {
    return this.http.put<any>(this.env + 'user/updateUser', user);
  }

  deleteUser(user: any) {
    return this.http.delete<any>(this.env + 'user/deleteUser/' + user._id);
  }

  emailUser(email: String) {
    return this.http.get<any>(this.env + `user/emailUser/${email}`);
  }
}
