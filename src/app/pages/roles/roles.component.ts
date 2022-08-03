import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { MenuService } from 'src/app/services/menu.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  public titulo:string='';
  public icono:string='';
  public cargando:boolean= true;
  public roles:Role[]=[];

  constructor(private menuService:MenuService, private roleService:RoleService) { 
    this.menuService.getTituloRuta().subscribe(({titulo, icono})=>{
      this.titulo= titulo;
      this.icono= icono;
    });
  }

  ngOnInit(): void {
    this.listarRoles();
  }

  listarRoles(){
    this.cargando= true;
    this.roleService.listar()
    .subscribe(({roles})=>{
        this.roles=roles;
        this.cargando= false;
    });
  }

}
