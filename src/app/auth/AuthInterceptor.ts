import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../service/shared/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes("/login") || request.url.includes('/register') || request.url.includes("/authenticate")) {
      return next.handle(request);
    }

    const user = this.loginService.currentUser;
    if (user.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ` + user.token
        }
      })
    }
    return next.handle(request);
  }
}
