import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptService {

  constructor() { }

  encrypt(value: string, key: string): string {
    if(value === null || key === null) return '';
    return CryptoJS.AES.encrypt(value.trim(), key.trim()).toString();
  }

  decrypt(value: string, key: string): string {
    if(value === null || key === null) return '';
    return CryptoJS.AES.decrypt(value.trim(), key.trim()).toString(CryptoJS.enc.Utf8);
  }

}
