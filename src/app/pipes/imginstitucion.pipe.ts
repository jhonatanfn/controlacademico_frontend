import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url= environment.base_url;

@Pipe({
  name: 'imginstitucion'
})
export class ImginstitucionPipe implements PipeTransform {

  transform(img: string): string {
    
    if(!img){
      return  `${base_url}/uploads/no-colegio.png`;
    }else{
      if(img?.includes('https')){
        return img;
      }else{
        if(img){
          return `${base_url}/uploads/${img}`;
        }else{
          return  `${base_url}/uploads/no-colegio.png`;
        }
      }
    }
  }

}
