import { Injectable } from '@angular/core';
import { AlertIcon } from '../enum/alert-icon.enum';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // Exhibe un alerta normal
  normalAlert(title: string, desc: string, icon: AlertIcon) {
    Swal.fire(title, desc, icon);
  }

  // Exhibe un alerta de tipo toast
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

  // Exhibe una confirmacion que aguarda un resultado
  async confirmAlert(title: string, desc: string, icon: AlertIcon, yes: string = 'Si', no: string = 'Cancelar') {
    return await Swal.fire({
      title: title,
      text: desc,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: no,
      confirmButtonText: yes,
    }).then((result) => {
      return result.isConfirmed;
    })

  }



}
