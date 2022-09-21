import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imginstitucion'
})
export class ImginstitucionPipe implements PipeTransform {

  transform(img: string): string {
    let retorno = "";
    if (!img) {
      retorno = `${base_url}/uploads/colegio/victorraulsullana.jpg`;
    } else {
      if (img?.includes('https') && navigator.onLine) {
        retorno = img;
      } else {
        retorno = `${base_url}/uploads/colegio/victorraulsullana.jpg`;
      }
    }
    return retorno;
  }

}
