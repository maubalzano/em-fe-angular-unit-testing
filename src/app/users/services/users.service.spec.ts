import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { UsersService } from './users.service';
import { EmailValidationService } from './email-validation.service';

export const MOCK_USERS = {"page":1,"per_page":6,"total":12,"total_pages":2,"data":[{"id":1,"email":"george.bluth@reqres.in","first_name":"George","last_name":"Bluth","avatar":"https://reqres.in/img/faces/1-image.jpg"},{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://reqres.in/img/faces/2-image.jpg"},{"id":3,"email":"emma.wong@reqres.in","first_name":"Emma","last_name":"Wong","avatar":"https://reqres.in/img/faces/3-image.jpg"},{"id":4,"email":"eve.holt@reqres.in","first_name":"Eve","last_name":"Holt","avatar":"https://reqres.in/img/faces/4-image.jpg"},{"id":5,"email":"charles.morris@reqres.in","first_name":"Charles","last_name":"Morris","avatar":"https://reqres.in/img/faces/5-image.jpg"},{"id":6,"email":"tracey.ramos@reqres.in","first_name":"Tracey","last_name":"Ramos","avatar":"https://reqres.in/img/faces/6-image.jpg"}],"support":{"url":"https://reqres.in/#support-heading","text":"To keep ReqRes free, contributions towards server costs are appreciated!"}}

describe('UsersService', () => {

  let baserUrl = 'https://reqres.in/api/';
  let usersService!: UsersService;
  let httpTestingController: HttpTestingController;
  let emailValidationSpy: any;

  beforeEach(() => {

    emailValidationSpy = jasmine.createSpyObj('Email Validation Service', ["checkIfEmailValid"]);

    TestBed.configureTestingModule({
      imports: [
          HttpClientTestingModule
        ],
        providers: [
          UsersService,
          {provide: EmailValidationService, useValue: emailValidationSpy}
      ]
  });

  usersService = TestBed.inject(UsersService),
  httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should retrieve all users', () => {

    const usersLength = MOCK_USERS.data.length;

    usersService.getAllUsers()
      .subscribe(users => {

        expect(users).toBeTruthy('No users returned');

        expect(users.length).toBe(MOCK_USERS.data.length);

        expect(emailValidationSpy.checkIfEmailValid).toHaveBeenCalledTimes(usersLength);
      })

      const req = httpTestingController.expectOne(baserUrl + 'users?page=1');

      expect(req.request.method).toEqual('GET');

      req.flush(MOCK_USERS);

  });

  it('should find a user by its id', () => {
    
    usersService.getUserById(1)
      .subscribe(user => {

        expect(user).toBeTruthy('User not found');

        expect(user.id).toBe(1);
      });

      const req = httpTestingController.expectOne(baserUrl + 'users/1');

      expect(req.request.method).toEqual('GET');

      req.flush({data: MOCK_USERS.data[0]});

  });

  it('should update a user', () => {
    
    const user = {
      ...MOCK_USERS.data[0],
      email: 'new-email@mail.com'
    };

    usersService.updateUser(user)
      .subscribe(user => {
        expect(user).toBeTruthy('Update user not successfull');

      });

      const req = httpTestingController.expectOne(baserUrl + `users/${MOCK_USERS.data[0].id}`);

      expect(req.request.method).toEqual('PUT');

      expect(req.request.body.email).toBe('new-email@mail.com');

      req.flush({data: user});
  })
});
