import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
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
  paginator: any;

  constructor(private userService: UserService, private alertService: AlertService, private errorHandlingService: ErrorHandlingService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub.push(
      this.activatedRoute.params.subscribe(params => {
        const page: number = params['page'];
        this.getVoluntarios(page);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  // carga los usuarios de forma pageable
  getVoluntarios(page: number = 0): void {
    this.loading = true;
    this.sub.push(
      this.userService.getUsersPage(page)
        .pipe(
          tap(response => {
            // Ordena por fecha descendiente
            response.content = (response.content as User[]).sort((a, b) => a.id < b.id ? 1 : -1);
          })
        )
        .subscribe({
          next: (data) => this.onSuccess(data),
          error: (e) => this.onFail(e),
          complete: () => this.loading = false
        })
    );
  }

  private onSuccess(data: any): void {
    this.paginator = data;
    this.users = data.content;
  }

  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.errorHandlingService.exec(e);
  }

}
