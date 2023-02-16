import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { EmailValidationService } from '../../services/email-validation.service';
import { UsersService } from '../../services/users.service';
import { MOCK_USERS } from '../../services/users.service.spec';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let el: DebugElement;
  let usersServiceSpy: any;

  beforeEach(async () => {

    usersServiceSpy = jasmine.createSpyObj('Users Service', ["getAllUsers", "getUserById", "updateUser"]);
   
    usersServiceSpy.getAllUsers.and.returnValue(of(MOCK_USERS.data));
    usersServiceSpy.getUserById.and.returnValue(of(MOCK_USERS.data[0]));
    usersServiceSpy.updateUser.and.returnValue(of({...MOCK_USERS.data[0], email: 'new_email@reqres.in'})); 

    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        {provide: UsersService, useValue: usersServiceSpy}
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(UsersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      el = fixture.debugElement;
  
      usersServiceSpy.getAllUsers.calls.reset();
  
    })
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all users on component init', fakeAsync(() => {

    component.ngOnInit();
    
    fixture.whenStable().then(() => {

      expect(usersServiceSpy.getAllUsers).toHaveBeenCalledTimes(1);

      const userCards = el.queryAll(By.css('.user-card'));

      expect(userCards).toBeDefined();

      expect(userCards.length).toBe(MOCK_USERS.data.length);

    })

  }));

  it('should display all users on refresh list', fakeAsync(() => {
    
    component.getAllUsers();

    fixture.whenStable().then(() => {

      expect(usersServiceSpy.getAllUsers).toHaveBeenCalledTimes(1);

      const userCards = el.queryAll(By.css('.user-card'));

      expect(userCards).toBeDefined();

      expect(userCards.length).toBe(MOCK_USERS.data.length);

    });
  }))

  it('should update data on user update', fakeAsync(() => {

    const newUser = {...MOCK_USERS.data[0], email: 'new_email@reqres.in'};
    
    component.updateUser(newUser);
    
    fixture.whenStable().then(() => {
      
      fixture.detectChanges();

      expect(usersServiceSpy.updateUser).toHaveBeenCalledOnceWith(newUser);

      const user = el.query(element => element.name === 'span' && element.nativeElement.textContent == 'new_email@reqres.in');

      expect(user).not.toBeNull();

    })
  }));

  it('should unsubscribe all subscriptions on destroy', () => {

    const getAllUsersSubscription = component["usersService"].getAllUsers().subscribe();
    const getUserByIdSubscription = component["usersService"].getUserById(1).subscribe();

    component.ngOnDestroy();

    expect(getAllUsersSubscription.closed).toBeTruthy();

    expect(getUserByIdSubscription.closed).toBeTruthy();

  })
  
});
