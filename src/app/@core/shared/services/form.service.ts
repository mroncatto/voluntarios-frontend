import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getErrorMessage(form: AbstractControl): string {
    if (form.hasError('pattern')) return "Patrón inválido";
    if (form.hasError('email')) return "Debes informar un correo válido";
    if (form.hasError('required')) return "Este campo es obligatorio";
    if (form.hasError('minlength')) return `Se requiere mínimo ${form.errors?.['minlength'].requiredLength} caracteres`;
    if (form.hasError('maxlength')) return `Se permite máximo ${form.errors?.['maxlength'].requiredLength} caracteres`;
    if (form.hasError('min')) return `Valor mínimo permitido es ${form.errors?.['min'].min}`;
    if (form.hasError('max')) return `Valor máximo permitido es ${form.errors?.['max'].max}`;
    return "Campo inválido";
  }

}
