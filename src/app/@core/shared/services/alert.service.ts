import { Injectable } from '@angular/core';
import { AlertIcon } from '../enum/alert-icon.enum';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  normalAlert(title: string, desc: string, icon: AlertIcon) {
    Swal.fire(title, desc, icon);
  }

  toastAlert(title: string, icon: AlertIcon, timer: number): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true
    });

    Toast.fire({
      icon: icon,
      title: title
    })
  }


}
