import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-totaltable',
  templateUrl: './totaltable.component.html',
  styleUrls: ['./totaltable.component.css']
})
export class TotaltableComponent implements OnInit {
  @Input() total:number=0;
  public regi:string="";
  constructor() {
    
  }
  ngOnInit(): void {
    if(this.total==1){
      this.regi ="Registro";
    }else{
      if(this.total>1){
        this.regi="Registros";
      }
    }
  }

}
