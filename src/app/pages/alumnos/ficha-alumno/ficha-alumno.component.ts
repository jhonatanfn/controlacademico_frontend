import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoService } from 'src/app/services/alumno.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as  moment from 'moment';
import { InstitucionService } from 'src/app/services/institucion.service';
import { Institucion } from 'src/app/models/institucion.model';

@Component({
  selector: 'app-ficha-alumno',
  templateUrl: './ficha-alumno.component.html',
  styleUrls: ['./ficha-alumno.component.css']
})
export class FichaAlumnoComponent implements OnInit {

  public titulo: string = 'Ficha del Alumno';
  public icono: string = 'bi bi-file-text';
  public alumno: any;
  public alumno_id!: number;
  public alumno_img: string = "";
  public alumno_dni: string = "";
  public alumno_nombres_apellidos: string = "";
  public institucion!: Institucion;
  public declaracion: string = "Declaro que la información proporcionada y documentos presentados en la ficha son verdaderos y pueden ser verificadas por parte del colegio.";

  constructor(private alumnoService: AlumnoService, private route: ActivatedRoute,
    private institucionService: InstitucionService) {
    this.institucion = this.institucionService.institucion;

    this.alumnoService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, alumno }) => {
          if (ok) {
            this.alumno = alumno;
            this.alumno_img = alumno.persona?.img || '';
            this.alumno_dni = alumno.persona?.dni || '';
            this.alumno_nombres_apellidos = (alumno.persona?.nombres + ' ' + alumno.persona?.apellidopaterno + ' ' +
              alumno.persona?.apellidopaterno);
            this.alumno_id = Number(alumno.id)
          }
        }
      });
  }

  ngOnInit(): void {
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx: any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  async generatePDF(accion: string) {

    let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
    let nombreArchivo = 'FICHA: ' + moment().format('DD/MM/yyyy') + '.pdf';

    let sexo_alumno = "";
    let alumno_nacimiento = "";
    let vivecon = "";
    let tienediscapacidad = "";
    let certificadodiscapacidad = "";
    let vivep="";
    let vivem="";

    if (this.alumno.persona?.sexo == 1) {
      sexo_alumno = "MASCULINO"
    } else {
      sexo_alumno = "FEMENINO"
    }
    if (this.alumno.persona?.fechanacimiento) {
      alumno_nacimiento = moment(this.alumno.persona?.fechanacimiento).format('DD/MM/yyyy')
    }
    if (this.alumno.vivecon == 1) {
      vivecon = "PADRE";
    }
    if (this.alumno.vivecon == 2) {
      vivecon = "MADRE";
    }
    if (this.alumno.vivecon == 3) {
      vivecon = "AMBOS PADRES";
    }
    if (this.alumno.vivecon == 4) {
      vivecon = "ABUELOS";
    }

    if(this.alumno.padre.vive){
      vivep= "SI";
    }else{
      vivep="NO";
    }
    if(this.alumno.madre.vive){
      vivem= "SI";
    }else{
      vivem="NO";
    }

    if (this.alumno.tienediscapacidad == 1) {
      tienediscapacidad = "NO";
    } else {
      tienediscapacidad = "SI";
    }
    if (this.alumno.certificadiscapacidad == 1) {
      certificadodiscapacidad = "NO";
    } else {
      certificadodiscapacidad = "SI";
    }
    if(this.alumno.cualdiscapacidad){
      this.alumno.cualdiscapacidad= (this.alumno.cualdiscapacidad).toUpperCase()
    }else{
      this.alumno.cualdiscapacidad= "";
    }
    if(this.alumno.inicialprocede){
      this.alumno.inicialprocede= (this.alumno.inicialprocede).toUpperCase()
    }else{
      this.alumno.inicialprocede= ""
    }
    if(this.alumno.colegioprocede){
      this.alumno.colegioprocede= (this.alumno.colegioprocede).toUpperCase()
    }else{
      this.alumno.colegioprocede= ""
    }
    if(this.alumno.observacion){
      this.alumno.observacion= (this.alumno.observacion).toUpperCase()
    }else{
      this.alumno.observacion= ""
    }

    /**Alumno */
    if(this.alumno.persona.nacionalidad){
      this.alumno.persona.nacionalidad = (this.alumno.persona.nacionalidad).toUpperCase()
    }else{
      this.alumno.persona.nacionalidad="";
    }
    if(this.alumno.persona.distrito){
      this.alumno.persona.distrito = (this.alumno.persona.distrito).toUpperCase()
    }else{
      this.alumno.persona.distrito="";
    }
    if(this.alumno.persona.correo){
      this.alumno.persona.correo = (this.alumno.persona.correo).toUpperCase()
    }else{
      this.alumno.persona.correo="";
    }
    if(this.alumno.persona.domicilio){
      this.alumno.persona.domicilio = (this.alumno.persona.domicilio).toUpperCase()
    }else{
      this.alumno.persona.domicilio="";
    }
    /**padre */
    if(this.alumno.padre.nacionalidad){
      this.alumno.padre.nacionalidad = (this.alumno.padre.nacionalidad).toUpperCase()
    }else{
      this.alumno.padre.nacionalidad="";
    }
    if(this.alumno.padre.distrito){
      this.alumno.padre.distrito = (this.alumno.padre.distrito).toUpperCase()
    }else{
      this.alumno.padre.distrito="";
    }
    if(this.alumno.padre.correo){
      this.alumno.padre.correo = (this.alumno.padre.correo).toUpperCase()
    }else{
      this.alumno.padre.correo="";
    }
    if(this.alumno.padre.domicilio){
      this.alumno.padre.domicilio = (this.alumno.padre.domicilio).toUpperCase()
    }else{
      this.alumno.padre.domicilio="";
    }
    /*madre*/
    if(this.alumno.madre.nacionalidad){
      this.alumno.madre.nacionalidad = (this.alumno.madre.nacionalidad).toUpperCase()
    }else{
      this.alumno.madre.nacionalidad="";
    }
    if(this.alumno.madre.distrito){
      this.alumno.madre.distrito = (this.alumno.madre.distrito).toUpperCase()
    }else{
      this.alumno.madre.distrito="";
    }
    if(this.alumno.madre.correo){
      this.alumno.madre.correo = (this.alumno.madre.correo).toUpperCase()
    }else{
      this.alumno.madre.correo="";
    }
    if(this.alumno.madre.domicilio){
      this.alumno.madre.domicilio = (this.alumno.madre.domicilio).toUpperCase()
    }else{
      this.alumno.madre.domicilio="";
    }
    /**responsable */
    if(this.alumno.responsable.nacionalidad){
      this.alumno.responsable.nacionalidad = (this.alumno.responsable.nacionalidad).toUpperCase()
    }else{
      this.alumno.responsable.nacionalidad="";
    }
    if(this.alumno.responsable.distrito){
      this.alumno.responsable.distrito = (this.alumno.responsable.distrito).toUpperCase()
    }else{
      this.alumno.responsable.distrito="";
    }
    if(this.alumno.responsable.correo){
      this.alumno.responsable.correo = (this.alumno.responsable.correo).toUpperCase()
    }else{
      this.alumno.responsable.correo="";
    }
    if(this.alumno.responsable.domicilio){
      this.alumno.responsable.domicilio = (this.alumno.responsable.domicilio).toUpperCase()
    }else{
      this.alumno.responsable.domicilio="";
    }

    var docDefinition: any = {
      content: [
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL(url),
              width: 60,
              height: 60,
            },
            {
              text: this.institucion.nombre,
              fontSize: 14,
              color: '#0000',
              margin: [3, 25, 1, 1],
              bold: true,
            }
          ]
        },
        {
          text: 'DIRECCIÓN: ' + this.institucion.direccion,
          fontSize: 10,
          color: '#0000',
          bold: true,
        },
        {
          text: 'TELÉFONO: ' + this.institucion.telefono,
          fontSize: 10,
          color: '#0000',
          bold: true,
        },
        {
          text: 'EMAIL: ' + this.institucion.email,
          fontSize: 10,
          color: '#0000',
          bold: true,
        },

        {
          text: 'FICHA FAMILIAR DEL ALUMNO',
          style: ['header'],
          margin: [0, 10, 0, 10],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black'
        },
        {
          text: 'DATOS GENERALES',
          margin: [0, 10, 0, 0],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black',
          fontSize: 12,
          bold: true,
        },

        {

          margin: [0, 1, 0, 5],
          table: {
            widths: [180, 300],
            body: [
              [
                { text: 'DNI', bold: true }, this.alumno.persona?.dni
              ],
              [
                { text: 'NOMBRES Y APELLIDOS', bold: true }, (this.alumno.persona?.nombres + ' ' + this.alumno.persona?.apellidopaterno + ' ' + this.alumno.persona?.apellidomaterno).toUpperCase()
              ],
              [
                { text: 'SEXO', bold: true }, sexo_alumno
              ],
              [
                { text: 'FECHA DE NACIMIENTO', bold: true }, alumno_nacimiento
              ],
              [
                { text: 'TELEFONO', bold: true }, this.alumno.persona?.telefono
              ],
              [
                { text: 'NACIONALIDAD', bold: true }, this.alumno.persona?.nacionalidad
              ],
              [
                { text: 'DISTRITO', bold: true }, this.alumno.persona?.distrito
              ],
              [
                { text: 'CORREO ELECTRÓNICO', bold: true }, this.alumno.persona?.correo
              ],
              [
                { text: 'DOMICILIO', bold: true }, this.alumno.persona?.domicilio
              ],
            ],
          }
        },
        {
          text: 'DATOS ESPECÍFICOS',
          margin: [0, 10, 0, 0],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black',
          fontSize: 12,
          bold: true,
        },
        {

          margin: [0, 1, 0, 5],
          table: {
            widths: [180, 300],
            body: [
              [
                { text: 'EL ALUMNO VIVE CON', bold: true }, vivecon
              ],
              [
                { text: 'TIENE DISCAPACIDAD', bold: true }, tienediscapacidad
              ],
              [
                { text: 'TIENE CERTIFICADO DISCAPACIDAD', bold: true }, certificadodiscapacidad
              ],
              [
                { text: 'CUAL DISCAPACIDAD', bold: true }, this.alumno.cualdiscapacidad
              ],
              [
                { text: 'I.E. INICIAL DE DONDE PROCEDE', bold: true }, this.alumno.inicialprocede
              ],
              [
                { text: 'COLEGIO DE PROCEDENCIA', bold: true }, this.alumno.colegioprocede
              ],
              [
                { text: 'OBSERVACIONES', bold: true }, this.alumno.observacion
              ],
            ],
          }
        },
        {
          text: 'DATOS DEL PADRE',
          margin: [0, 10, 0, 0],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black',
          fontSize: 12,
          bold: true,
        },
        {

          margin: [0, 1, 0, 5],
          table: {
            widths: [180, 300],
            body: [
              [
                { text: 'VIVE', bold: true }, vivep
              ],
              [
                { text: 'DNI', bold: true }, this.alumno.padre?.persona?.dni
              ],
              [
                { text: 'NOMBRES Y APELLIDOS', bold: true }, (this.alumno.padre?.persona?.nombres + ' ' + this.alumno.padre?.persona?.apellidopaterno + ' ' + this.alumno.padre?.persona?.apellidomaterno).toUpperCase()
              ],
              [
                { text: 'TELEFONO', bold: true }, this.alumno.padre?.persona?.telefono
              ],
              [
                { text: 'NACIONALIDAD', bold: true }, this.alumno.padre?.persona?.nacionalidad
              ],
              [
                { text: 'DISTRITO', bold: true }, this.alumno.padre?.persona?.distrito
              ],
              [
                { text: 'CORREO ELECTRÓNICO', bold: true }, this.alumno.padre?.persona?.correo
              ],
              [
                { text: 'DOMICILIO', bold: true }, this.alumno.padre?.persona?.domicilio
              ],
            ],
          }
        },
        {
          text: 'DATOS DE LA MADRE',
          margin: [0, 10, 0, 0],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black',
          fontSize: 12,
          bold: true,
        },
        {

          margin: [0, 1, 0, 5],
          table: {
            widths: [180, 300],
            body: [
              [
                { text: 'VIVE', bold: true }, vivem
              ],
              [
                { text: 'DNI', bold: true }, this.alumno.madre?.persona?.dni
              ],
              [
                { text: 'NOMBRES Y APELLIDOS', bold: true }, (this.alumno.madre?.persona?.nombres + ' ' + this.alumno.madre?.persona?.apellidopaterno + ' ' + this.alumno.madre?.persona?.apellidomaterno).toUpperCase()
              ],
              [
                { text: 'TELEFONO', bold: true }, this.alumno.madre?.persona?.telefono
              ],
              [
                { text: 'NACIONALIDAD', bold: true }, this.alumno.madre?.persona?.nacionalidad
              ],
              [
                { text: 'DISTRITO', bold: true }, this.alumno.madre?.persona?.distrito
              ],
              [
                { text: 'CORREO ELECTRÓNICO', bold: true }, this.alumno.madre?.persona?.correo
              ],
              [
                { text: 'DOMICILIO', bold: true }, this.alumno.madre?.persona?.domicilio
              ],
            ],
          }
        },
        {
          text: 'DATOS DEl APODERADO/RESPONSABLE DE LA INSCRIPCIÓN',
          margin: [0, 10, 0, 0],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black',
          fontSize: 12,
          bold: true,
        },
        {

          margin: [0, 1, 0, 5],
          table: {
            widths: [180, 300],
            body: [
              [
                { text: 'DNI', bold: true }, this.alumno.responsable?.persona?.dni
              ],
              [
                { text: 'NOMBRES Y APELLIDOS', bold: true }, (this.alumno.responsable?.persona?.nombres + ' ' + this.alumno.madre?.persona?.apellidopaterno + ' ' + this.alumno.madre?.persona?.apellidomaterno).toUpperCase()
              ],
              [
                { text: 'TELEFONO', bold: true }, this.alumno.responsable?.persona?.telefono
              ],
              [
                { text: 'NACIONALIDAD', bold: true }, this.alumno.responsable?.persona?.nacionalidad
              ],
              [
                { text: 'DISTRITO', bold: true }, this.alumno.responsable?.persona?.distrito
              ],
              [
                { text: 'CORREO ELECTRÓNICO', bold: true }, this.alumno.responsable?.persona?.correo
              ],
              [
                { text: 'DOMICILIO', bold: true }, this.alumno.responsable?.persona?.domicilio
              ],
            ],
          }
        },
        {
          text: this.declaracion, bold: true,
          margin: [0, 10, 0, 30],
        },
        {
          text: "FIRMA DEL RESPONSABLE",
          style: ['firma'],
          margin: [0, 25, 0, 20],
          decoration: 'overline',
          decorationStyle: 'solid',
          decorationColor: 'black',
          bold: true
        },

      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: "center",
        },
        firma: {
          fontSize: 12,
          bold: true,
          alignment: "center",
        }
      }
    };

    if (accion === "OPEN") {
      pdfMake.createPdf(docDefinition).open();
    } else {
      if (accion === "PRINT") {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download(nombreArchivo);
      }
    }

  }

}
