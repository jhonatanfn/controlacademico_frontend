import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadertableComponent } from './headertable/headertable.component';
import { TotaltableComponent } from './totaltable/totaltable.component';



@NgModule({
  declarations: [
    HeadertableComponent,
    TotaltableComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    HeadertableComponent,
    TotaltableComponent
  ]
})
export class ComponentsModule { }
