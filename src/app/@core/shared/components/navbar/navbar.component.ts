import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/@core/components/user/user.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user!: User | null;
  constructor(public authService: AuthService, private router: Router) {
    this.authService.getLoggedInName.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
  }

  // Realiza logout
  onLogout(): void {
    this.authService.onLogout();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }


}
