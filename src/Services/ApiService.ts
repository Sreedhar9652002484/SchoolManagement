import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface InputRequest {
  reqObj: string;
}

export interface ResponseModel {
  STCODE: string;
  MESSAGE?: string;
  ERRORMSG?: string;
  DATA?: any;
  ROLE:any;
  TOKEN:any;
}

export interface ParsedResponse<T = any> {
  success: boolean;
  StCode :any,
  message: string;
  data?: T;
  role:any;
  token:any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private readonly apiUrl = 'http://localhost:5066/api'; 



  constructor(private http: HttpClient) { }

  postRequest<T = any>(endpoint: string, req: any): Observable<ParsedResponse<T>> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/${endpoint}`, req)
      .pipe(
        map(response => this.parseResponse<T>(response)),
        catchError(this.handleError)
        
      );
       
  }

  parseResponse<T>(response: ResponseModel): ParsedResponse<T> {
    if (!response) {
      return {
        StCode:undefined,
  success: false,
  message: 'No response received from server.',
  role: undefined,
  token:undefined,
};
    }

    const isSuccess = response.STCODE === 'S';
    return {
      StCode:response.STCODE,
      success: isSuccess,
      message: isSuccess ? (response.MESSAGE || 'Operation successful.') : (response.ERRORMSG || 'Operation failed.'),
      data: response.DATA as T,
      role:response.ROLE,
      token:response.TOKEN
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMsg = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.ERRORMSG) {
        errorMsg = error.error.ERRORMSG;
      }
    }
    return throwError(() => new Error(errorMsg));
  }
}