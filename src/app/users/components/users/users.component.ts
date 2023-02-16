import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public users!: User[];
  private destroy$!: Subject<void>;

  constructor(
    private usersService: UsersService
  ) {
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.getAllUsers()
  };
  
  getAllUsers(){
    this.usersService.getAllUsers()
    .pipe(takeUntil(this.destroy$))
    .subscribe(users => this.users = users);
  }
  
  getUserById(id: number){
    return this.usersService.getUserById(1)
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {});
  }

  updateUser(user: User){
    this.usersService.updateUser(user).subscribe(user => {
      let userList =[...this.users];
      let userIndex = userList.findIndex(usr => usr.id == user.id);
      userList[userIndex] = user;
      this.users = userList;
      console.log(this.users)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
