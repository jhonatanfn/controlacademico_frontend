import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdmindocenteGuard implements CanActivate, CanLoad {

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if (this.usuarioService.usuario.role.nombre === 'DOCENTE' ||
      this.usuarioService.usuario.role.nombre === 'ADMINISTRADOR') {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usuarioService.usuario.role.nombre === 'DOCENTE' ||
      this.usuarioService.usuario.role.nombre === 'ADMINISTRADOR') {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
