import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url= environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string): string {
    let retorno = "";
    if(!img){
     retorno= `${base_url}/uploads/no-img.jpg`;
    }else{
      if(img?.includes('https') && navigator.onLine){
        retorno= img;
      }else{
        retorno= `${base_url}/uploads/no-img.jpg`;
      }
    }
    return retorno;
  }

}
