import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  public icono: string = "";
  public accion: string = "";
  public enlace: string = "";
  public titulo: string = "";

  constructor(private menuService: MenuService) {
    this.menuService.cargarMenu();

    this.menuService.getTituloRuta()
      .subscribe(({ accion, enlace, titulo, icono }) => {
        this.icono = icono;
        this.accion = accion;
        this.enlace = enlace;
        this.titulo = titulo;
      });

  }

  ngOnInit(): void {
  }

}
