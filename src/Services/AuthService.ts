import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode'; 

interface DecodedToken {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  exp?: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private decodeToken(): DecodedToken | null {
    const token = localStorage.getItem('Token');
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return null;
    }
  }

  getRole(): string | null {
    debugger
    const decoded = this.decodeToken();
    return decoded?.['role'] || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']|| null;
  }

  getUserId(): number | null {
    const decoded = this.decodeToken();
    const id = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return id ? Number(id) : null;
  }

  getEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
  }

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded?.exp) return true;

    const expiryTime = decoded.exp * 1000;
    return Date.now() > expiryTime;
  }

  logout(): void {
    localStorage.clear();
  }
}
