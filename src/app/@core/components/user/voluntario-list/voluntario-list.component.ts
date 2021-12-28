import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { User } from '../user.entity';
import { UserService } from '../user.service';

@Component({
  selector: 'app-voluntario-list',
  templateUrl: './voluntario-list.component.html',
  styleUrls: ['./voluntario-list.component.css']
})
export class VoluntarioListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  private sub: Subscription[] = [];
  loading: boolean = false;
  constructor(private userService: UserService, private alertService: AlertService, private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {
    this.getVoluntarios();
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  getVoluntarios(): void {
    this.sub.push(
      this.userService.getUsers().subscribe({
        next: (data) => this.onSuccess(data),
        error: (e) => this.onFail(e),
        complete: () => this.loading = false
      })
    );
  }

  private onSuccess(data: User[]): void {
    this.users = data;
  }

  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.errorHandlingService.exec(e);
  }

}
