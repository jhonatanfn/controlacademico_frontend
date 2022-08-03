import { Component, OnInit } from '@angular/core';
import { Institucion } from 'src/app/models/institucion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuItems:any[];
  public usuario!: Usuario;
  public institucion:Institucion={
    nombre: "",
    direccion:"",
    telefono:"",
    email:"",
    img:""
  };

  constructor(private institucionService:InstitucionService, 
  private menuServices:MenuService,private usuarioService:UsuarioService) {
    this.menuItems= this.menuServices.menu;
    this.usuario = this.usuarioService.usuario;
    this.institucion= this.institucionService.institucion;
  }

  ngOnInit(): void {
    
  }

  logout(){
    this.usuarioService.logout();
  }

}
