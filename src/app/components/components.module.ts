import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadertableComponent } from './headertable/headertable.component';



@NgModule({
  declarations: [
    HeadertableComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    HeadertableComponent
  ]
})
export class ComponentsModule { }
