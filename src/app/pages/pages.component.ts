import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  public principal:string="";
  public accion:string="";
  public enlace:string="";

  constructor(private menuService:MenuService) {
    this.menuService.cargarMenu(); 

    this.menuService.getTituloRuta()
    .subscribe(({principal,accion,enlace})=>{
      this.principal=principal;
      this.accion=accion;
      this.enlace=enlace;
    });

  }

  ngOnInit(): void {
  }

}
