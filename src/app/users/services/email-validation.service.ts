import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {

  constructor() { }

  // Return true if email is of format "firstName.lastName@reqres.in"
  
  public checkIfEmailValid(email: string, firstName: string, lastName: string) {

    const expectedEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@reqres.in`;
    
    return email === expectedEmail
  
  }
}
