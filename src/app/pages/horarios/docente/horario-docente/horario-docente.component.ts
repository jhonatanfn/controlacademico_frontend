import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Aula } from 'src/app/models/aula.model';
import { Hora } from 'src/app/models/hora.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Subarea } from 'src/app/models/subarea.model';
import { HoraService } from 'src/app/services/hora.service';
import { HorarioService } from 'src/app/services/horario.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alumno } from 'src/app/models/alumno.model';
import { Docente } from 'src/app/models/docente.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-horario-docente',
  templateUrl: './horario-docente.component.html',
  styleUrls: ['./horario-docente.component.css']
})
export class HorarioDocenteComponent implements OnInit {

  public titulo: string = 'Consultar Horarios';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Horarios';
  public icono2: string = 'bi bi-calendar-check';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public horarioForm!: FormGroup;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public aulasAux: Aula[] = [];
  public subareas: Subarea[] = [];
  public dias: any[] = [];
  public horas: Hora[] = [];
  public formSubmitted: boolean = false;
  public cargando: boolean = false;
  public datos: any[] = [];
  public intervalos: any[] = [];
  public datosSave: any[] = [];
  public columna: number = 0;
  public programaciones: Programacion[] = [];
  public message: string = "No hay horario";
  public institucion!: Institucion;
  public periodonombre:string="";
  public docentenombre:string="";
  public aulanombre: string = "";
  public nivelnombre: string = "";
  public gradonombre: string = "";
  public seccionnombre: string = "";
  public alumno!: Alumno;
  public docente!: Docente;

  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService,
    private usuarioService: UsuarioService,
    private horarioService: HorarioService, private horaService: HoraService,
    private institucionService: InstitucionService) {

    if (this.usuarioService.usuario.role.nombre === "DOCENTE") {
      this.dias = this.horarioService.dias;
      this.institucion = this.institucionService.institucion;
      this.usuarioService.docentePorPersona().subscribe({
        next: ({ ok, docente }) => {
          if (ok) {
            this.docente = docente;
            this.docentenombre= this.docente.persona?.nombres+' '+
            this.docente.persona?.apellidopaterno+' '+
            this.docente.persona?.apellidomaterno;
            this.horarioForm.controls['docenteId'].setValue(this.docente.id);

            this.periodoService.todo().subscribe({
              next: ({ ok, periodos }) => {
                if (ok) {
                  this.periodos = periodos;
                }
              }
            });
            this.horaService.todo().subscribe({
              next: ({ ok, horas }) => {
                if (ok) {
                  this.horas = horas;
                }
              }
            });
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      periodoId: ['', Validators.required],
      docenteId: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.horarioForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarHorario() {
    this.formSubmitted = true;
    this.datos = [];
    this.intervalos = [];
    if (this.horarioForm.valid) {
      this.cargando = true;
      let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');
      this.periodonombre= arrperiodos[1];
      this.horarioService.horariosPeriododDocente(
        Number(arrperiodos[0]),
        Number(this.horarioForm.get('docenteId')?.value))
        .subscribe({
          next: ({ horarios }) => {
            if (horarios.length > 0) {
              this.horas.forEach(objh => {
                this.dias.forEach(objd => {
                  let resultado = this.obtenerObjetoHorario(horarios, objd.nombre, objh.id!);
                  let objeto = {
                    id: resultado.id,
                    dia: objd,
                    hora: objh,
                    subareaId: resultado.subareaId,
                    programacionId: resultado.programacionId,
                    programacion: resultado.programacion
                  }
                  this.datos.push(objeto);
                });
              });

              let numerofilas = this.datos.length / 5;
              let inicioAux = 0;
              let finalAux = 5;
              let control = 1;

              while (control <= numerofilas) {
                this.intervalos.push({
                  inicio: inicioAux,
                  final: finalAux,
                  rango: this.horas[control - 1]
                });
                inicioAux = finalAux;
                finalAux = finalAux + 5;
                control = control + 1;
              }
            }
            this.cargando = false;
          }
        });
    }
  }

  obtenerObjetoHorario(vector: any[], dia: string, hora: number) {
    let retorno = {
      id: 0,
      subareaId: 0,
      programacionId: 0,
      programacion: ""
    };
    vector.forEach(item => {
      if (item.dia === dia && item.horaId === hora) {
        retorno = {
          id: item.id,
          subareaId: item.programacion.subarea.id,
          programacionId: item.programacion.id,
          programacion: item.programacion
        }
      }
    });
    return retorno;
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
    if (this.horarioForm.valid) {
      let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
      let nombreArchivo = 'REPORTE: ' + moment().format('DD/MM/yyyy') + '.pdf';
      let arrPeriodos = (this.horarioForm.get('periodoId')?.value).split(',');

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
            text: 'HORARIO DE CLASES',
            style: ['header'],
            margin: [0, 10, 0, 10],
            decoration: 'underline',
            decorationStyle: 'solid',
            decorationColor: 'black'
          },
          {
            text: [
              { text: 'PERIODO: ', bold: true }, arrPeriodos[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },

          /*
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
              { text: 'NIVEL: ', bold: true, }, this.nivelnombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'GRADO: ', bold: true, }, this.gradonombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'SECCION: ', bold: true, }, this.seccionnombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          */
          {
            margin: [0, 10, 0, 15],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: '' },
                  { text: 'LUNES', bold: true, alignment: 'center' },
                  { text: 'MARTES', bold: true, alignment: 'center' },
                  { text: 'MIERCOLES', bold: true, alignment: 'center' },
                  { text: 'JUEVES', bold: true, alignment: 'center' },
                  { text: 'VIERNES', bold: true, alignment: 'center' },
                ],

                ...this.intervalos.map(intervalo => (
                  [
                    [
                      { text: intervalo.rango.inicio + '-' + intervalo.rango.fin, alignment: 'center' },
                    ],
                    [
                      { text: this.datos[intervalo.inicio].programacion?.subarea?.nombre, alignment: 'center',bold: true },
                      { text: this.datos[intervalo.inicio].programacion?.aula?.nombre, alignment: 'center' }
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 1].programacion?.subarea?.nombre, alignment: 'center',bold: true },
                      { text: this.datos[intervalo.inicio + 1].programacion?.aula?.nombre, alignment: 'center' }
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 2].programacion?.subarea?.nombre, alignment: 'center',bold: true },
                      { text: this.datos[intervalo.inicio + 2].programacion?.aula?.nombre, alignment: 'center' }
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 3].programacion?.subarea?.nombre, alignment: 'center',bold: true },
                      { text: this.datos[intervalo.inicio + 3].programacion?.aula?.nombre, alignment: 'center' }
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 4].programacion?.subarea?.nombre, alignment: 'center',bold: true },
                      { text: this.datos[intervalo.inicio + 4].programacion?.aula?.nombre, alignment: 'center' }
                    ],
                  ]
                )),
              ]
            }
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

}
