import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
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
     
      if(this.usuarioService.usuario.role.nombre==='PADRE' || 
      this.usuarioService.usuario.role.nombre==='MADRE'){
        return true;
      }else{
        this.router.navigateByUrl('dashboard');
        return false;
      }

  }
  
}
