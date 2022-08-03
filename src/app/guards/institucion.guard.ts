import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InstitucionService } from '../services/institucion.service';

@Injectable({
  providedIn: 'root'
})
export class InstitucionGuard implements CanActivate, CanLoad {

  constructor(private institucionService:InstitucionService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
      return this.institucionService.getInstitucion()
      .pipe(
        tap(resp => {
          if (resp) {
            console.log(resp);
          }
        })
        
      );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.institucionService.getInstitucion()
      .pipe(
        tap(resp => {
          if (resp) {
            console.log(resp);
          }
        })
        
      );
  }
}
