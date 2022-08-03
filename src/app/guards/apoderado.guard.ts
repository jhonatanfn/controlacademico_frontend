import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoGuard implements CanActivate {
  
  constructor(private usuarioService:UsuarioService, private router:Router){
    
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
     
      if(this.usuarioService.usuario.role.nombre==='APODERADO'){
        return true;
      }else{
        this.router.navigateByUrl('dashboard');
        return false;
      }

  }
  
}
