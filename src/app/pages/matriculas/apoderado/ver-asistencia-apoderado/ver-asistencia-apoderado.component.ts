import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia.model';
import { Institucion } from 'src/app/models/institucion.model';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import Swal from 'sweetalert2';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ver-asistencia-apoderado',
  templateUrl: './ver-asistencia-apoderado.component.html',
  styleUrls: ['./ver-asistencia-apoderado.component.css']
})
export class VerAsistenciaApoderadoComponent implements OnInit {

  public titulo1: string = 'Buscar Asistencias';
  public icono1: string = 'bi bi-search';
  public titulo2: string = 'Tabla Asistencias';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public asistencias:Asistencia[]=[];
  public asisForm!: FormGroup;
  public formSubmitted: boolean = false;
  public cargando:boolean= false;

  public periodonombre:string="";
  public aulanombre:string="";
  public subareanombre:string="";
  public docentenombre:string="";
  public fechai:number=0;
  public fechaf:number=0;
  public asistenciatotal:number=0;
  public faltatotal:number=0;
  public justificatotal:number=0;
  public alumnonombre:string="";

  public institucion!: Institucion;

  constructor(private asisteciaService:AsistenciaService,
    private route: ActivatedRoute, private fb:FormBuilder,
    private matriculaService:MatriculaService,private institucionService:InstitucionService) {

      this.matriculaService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ok,matricula})=>{
          if(ok){
            this.periodonombre= matricula.programacion?.periodo?.nombre!;
            this.aulanombre=matricula.programacion?.aula?.nombre!;
            this.subareanombre=matricula.programacion?.subarea?.nombre!;
            this.docentenombre=matricula.programacion?.docente?.persona?.nombres!+' '+
            matricula.programacion?.docente?.persona?.apellidopaterno!+' '+
            matricula.programacion?.docente?.persona?.apellidomaterno!;
            this.alumnonombre= matricula.alumno?.persona?.nombres+' '+
            matricula.alumno?.persona?.apellidopaterno+' '+
            matricula.alumno?.persona?.apellidomaterno; 
          }
        },
        error: (error)=>{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "Se produjo un error. Hable con el administrador",
            showConfirmButton: false,
            timer: 1000
          });
        }
      });

      this.institucion = this.institucionService.institucion;
      
    }

  ngOnInit(): void {
    this.asisForm = this.fb.group({
      fechainicial: ['', Validators.required]
    });
  }

  listarAsistencias(){
    this.asisteciaService.asistenciasPorMatricula(
      Number(this.route.snapshot.paramMap.get('id')),
      this.asisForm.get('fechainicial')?.value
    )
    .subscribe(({ok,asistencias})=>{
      if(ok){
        this.asistencias= asistencias;
      }
    });
  }

  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarAsistencias(){
    this.formSubmitted= true;
    if(this.asisForm.valid){
      this.cargando= true;
      this.asisteciaService.asistenciasPorMatricula(
        Number(this.route.snapshot.paramMap.get('id')),
        this.asisForm.get('fechainicial')?.value
      )
      .subscribe({
        next: ({ok,asistencias})=>{
          if(ok){
            this.asistencias= asistencias;
            this.alumnonombre= asistencias[0].matricula?.alumno?.persona?.nombres+' '+
            asistencias[0].matricula?.alumno?.persona?.apellidopaterno+' '+
            asistencias[0].matricula?.alumno?.persona?.apellidomaterno;
            this.fechai=  this.asisForm.get('fechainicial')?.value;
            this.calcular();
            this.cargando= false;
          }
        },
        error:(error)=>{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "Se produjo un error. Hable con el administrador",
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    }
  }

  calcular(){
    let asistio=0;
    let falto=0;
    let justifico=0;
    this.asistencias.forEach(asistencia=>{
      if(asistencia.situacion?.id===4){
        falto= falto+1;
      }
      if(asistencia.situacion?.id===14){
        asistio= asistio+1;
      }
      if(asistencia.situacion?.id===24){
        justifico= justifico+1;
      }
    });
    this.asistenciatotal= asistio;
    this.faltatotal= falto;
    this.justificatotal= justifico;
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
    this.formSubmitted = true;

    if (this.asisForm.valid) {
      let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
      let nombreArchivo = 'REPORTE: ' + moment().format('DD/MM/yyyy') + '.pdf';
     
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
                margin: [3, 25, 0, 0],
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
            text: 'REPORTE DE ASISTENCIAS',
            style: ['header'],
            margin: [0, 10, 0, 10],
            decoration: 'underline',
            decorationStyle: 'solid',
            decorationColor: 'black'
          },
          {
            text: [
              { text: 'PERIODO: ', bold: true, }, this.periodonombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'AULA: ', bold: true, }, this.aulanombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'SUBAREA: ', bold: true }, this.subareanombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'DOCENTE: ', bold: true }, this.docentenombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'ALUMNO: ', bold: true }, this.alumnonombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'FECHA CONSULTADA : ', bold: true, }, moment(this.asisForm.get('fechainicial')?.value).format('DD/MM/yyyy')
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'SITUACIÓN : ', bold: true, }, this.asistencias[0].situacion?.nombre
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'FECHA REPORTE: ', bold: true, }, moment(this.asisForm.get('fecha')?.value).format('DD/MM/yyyy')
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 1],
          },



          /*
          {
            //layout: 'lightHorizontalLines',
            margin: [0, 10, 0, 15],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'FECHA', bold: true, alignment: 'center' },
                  { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                ],
                ...this.asistencias.map(p => (
                  [
                    this.asistencias.indexOf(p) + 1,
                    moment(p.fecha).format('DD/MM/yyyy'),
                    { text: p.situacion?.nombre, alignment: 'center'},
                  ])),
              ]
            }
          },

          {
            text: [
              { text: 'RESUMEN: ', bold: true, }
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 5, 0, 2],
          },

          {
            //layout: 'lightHorizontalLines',
            margin: [0, 1, 0, 5],
            table:{
              widths: [100, 'auto'],
              body: [
                [
                  'ASISTIÓ: ', this.asistenciatotal,
                ],
                [
                  'FALTÓ: ', this.faltatotal
                ],
                [
                  'JUSTIFICÓ: ', this.justificatotal
                ]
              ],
            }
          },

          */


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

}
