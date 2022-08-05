import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  menuItems:any[]=[];
  public menus:any[]=[];
  constructor(private menuServices:MenuService) { 
    /*
    this.menuItems= this.menuServices.menu;
    this.menus=[];
    this.menuItems.forEach(menuItem => {
      if(menuItem.submenu.length>0){
        menuItem.submenu.forEach((elemento:any) => {
          this.menus.push(elemento);
        });
      }else{
        this.menus.push(menuItem);
      }
    });
    */
  }

  ngOnInit(): void {
  }

}
