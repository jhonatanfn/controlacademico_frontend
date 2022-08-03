import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-headertable',
  templateUrl: './headertable.component.html',
  styleUrls: ['./headertable.component.css']
})
export class HeadertableComponent implements OnInit {

  @Input() titulo:string='';
  @Input() icono:string='';

  constructor() {}

  ngOnInit(): void {
  }

}
