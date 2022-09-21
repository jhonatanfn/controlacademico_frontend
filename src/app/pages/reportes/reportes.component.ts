import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  menuItems:any[]=[];
  menuItemsReportes:any[]=[];

  constructor(private menuServices:MenuService) {

    this.menuItems= this.menuServices.menu;
    this.menuItems.forEach(menuItem=>{
      if(menuItem.titulo=="Opciones"){
        menuItem.submenu.forEach((submenu:any) => {
          this.menuItemsReportes.push(submenu);
        });
      }
    });
  }

  ngOnInit(): void {
  }

}
