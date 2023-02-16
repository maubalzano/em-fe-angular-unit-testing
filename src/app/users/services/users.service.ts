import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EmailValidationService } from './email-validation.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'https://reqres.in/api/';
  private usersPath = 'users';

  constructor(
    private http: HttpClient,
    private emailValidationService: EmailValidationService
  ) { }

  getAllUsers(): Observable<User[]> {
    let params = new HttpParams();
    params = params.set('page', 1);
    return this.http.get<any>(this.apiUrl + this.usersPath, {params}).pipe(
      map(res => res.data.map((user: User) => {
        
        const isEmailValid = this.emailValidationService.checkIfEmailValid(user.email, user.first_name, user.last_name)
        
        user = { ...user, isEmailValid };
        
        return user
      }))
    )
  }

  getUserById(id: number) {
    return this.http.get<any>(this.apiUrl + this.usersPath + '/' + id).pipe(
      map(res => res.data)
    )
  }

  updateUser(user: User) {
    return this.http.put<any>(this.apiUrl + this.usersPath + '/' + user.id, user)
  }
}

export interface User {
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  avatar: string,
  isEmailValid?: boolean
}

