import { SpinnerService } from './../services/spinner/spinner.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';
import { LoginService } from '../services/auth/login.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    // private authService: AuthService,
    private spinner: SpinnerService,
    private loginService: LoginService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();

    if (!this.loginService.IsUserLogged()) {
      return next.handle(req).pipe(
        delay(300),
        finalize(() => this.spinner.hide())
      );
    }
    const userInformation = this.loginService.GetUserInformation();

    const request = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${userInformation.token}`,
      }),
    });
    return next.handle(request).pipe(
      delay(300),
      finalize(() => this.spinner.hide())
    );
  }
}
