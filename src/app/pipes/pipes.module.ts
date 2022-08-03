import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { ImgareaPipe } from './imgarea.pipe';
import { ImginstitucionPipe } from './imginstitucion.pipe';



@NgModule({
  declarations: [
    ImagenPipe,
    ImgareaPipe,
    ImginstitucionPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ImagenPipe,
    ImgareaPipe,
    ImginstitucionPipe
  ]
})
export class PipesModule { }
