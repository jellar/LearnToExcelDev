import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { tokenNotExpired, JwtHelper, AuthHttp } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NgProgressService } from 'ngx-progressbar';
@Injectable()
export class AuthService {

  tokenEndpoint = 'api/account/generateToken';
  requireLoginSubject: Subject<boolean>;
  tokenIsBeingRefreshed: Subject<boolean>;
  lastUrl: string;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http, private router: Router
              , private progress: NgProgressService) {
    this.requireLoginSubject = new Subject<boolean>();
    this.tokenIsBeingRefreshed = new Subject<boolean>();
    this.tokenIsBeingRefreshed.next(false);
    this.lastUrl = '/dashboard';
  }

  isUserAuthenticated() {
    console.log('login check');
    if (this.loggedIn()) {
        console.log('logged In');
       this.requireLoginSubject.next(false);
      return true;
    } else {
      console.log('NOT logged In');
      return false;
    }
  }

  login(username: string, password: string) {
    this.progress.start();
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });
    const body = new URLSearchParams();
    body.set('email', username);
    body.set('password', password);
    // body.set('grant_type', 'password');

    return this.http.post(this.tokenEndpoint, body, options)
            .map(response => {
              const user = response.json();
              const token = response.json() && response.json().token;
              if (token) {
                   this.addTokens(response.json().token, response.json().token);
                  localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
                    return true;
                  }else {
                  return false;
            }
            }).catch((e) => {
               return Observable.throw(
                new Error(`${ e.status } ${ e.statusText }`)
              );
            });
  }

  private StoreToken(data) {
         // login successful if there's a jwt token in the response
        const token = data.response.json() && data.response.json().access_token;
        if (token) {
            // set token property
            this.addTokens(data.response.json().token, data.response.json().token);
            localStorage.setItem('currentUser', JSON.stringify({username: 'username', token: token}));
            this.progress.done();
            return true;
        } else {
            return false;
        }
  }
  /**
   * Handle any errors from the API
   */
  private handleError(err) {
    console.log(err);

    let errMessage: string;

    if (err instanceof Response) {
      const body   = err.json() || '';
      const error  = JSON.stringify(body);
      errMessage = `${err.status} - ${err.statusText} || ''} ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
    }

    return Observable.throw(errMessage);
  }
  loggedIn() {
    return tokenNotExpired('id_token');
  }

  addTokens(accessToken: string, refreshToken: string) {
    console.log('store token');
    localStorage.setItem('id_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  refreshTokenSuccessHandler(data) {
    if (data.error) {
        this.logout();
        this.requireLoginSubject.next(true);
        this.tokenIsBeingRefreshed.next(false);
        this.router.navigateByUrl('/login');
        return false;
    } else {
        this.addTokens(data.access_token, data.refresh_token);
        this.requireLoginSubject.next(false);
        this.tokenIsBeingRefreshed.next(false);
    }
  }

  refreshTokenErrorHandler(error) {
    this.requireLoginSubject.next(true);
    this.logout();
    this.tokenIsBeingRefreshed.next(false);
    this.router.navigate(['/login']);
    console.log(error);
  }

  refreshToken() {
    const refToken = localStorage.getItem('refresh_token');
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refToken);

    return this.http.post(this.tokenEndpoint, body, options)
                    .map(res => res.json());
  }

  tokenRequiresRefresh(): boolean {
    const token = localStorage.getItem('id_token');
    if (!this.loggedIn()) {
      console.log('Token refresh is required');
    }

    return !this.loggedIn();
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    this.requireLoginSubject.next(true);
  }
}
