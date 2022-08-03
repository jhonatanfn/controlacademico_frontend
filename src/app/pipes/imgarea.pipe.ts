import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url= environment.base_url;

@Pipe({
  name: 'imgarea'
})
export class ImgareaPipe implements PipeTransform {

  transform(img: string): string {
    
    if(!img){
      return  `${base_url}/uploads/no-area.jpg`;
    }else{
      if(img?.includes('https')){
        return img;
      }else{
        if(img){
          return `${base_url}/uploads/${img}`;
        }else{
          return  `${base_url}/uploads/no-area.jpg`;
        }
      }
    }
  }

}
