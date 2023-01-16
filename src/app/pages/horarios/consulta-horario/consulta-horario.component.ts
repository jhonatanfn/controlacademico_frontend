import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Aula } from 'src/app/models/aula.model';
import { Hora } from 'src/app/models/hora.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { AulaService } from 'src/app/services/aula.service';
import { HoraService } from 'src/app/services/hora.service';
import { HorarioService } from 'src/app/services/horario.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AreaService } from 'src/app/services/area.service';
import { Area } from 'src/app/models/area.model';

@Component({
  selector: 'app-consulta-horario',
  templateUrl: './consulta-horario.component.html',
  styleUrls: ['./consulta-horario.component.css']
})
export class ConsultaHorarioComponent implements OnInit {

  public titulo: string = 'Consultar Horarios';
  public icono: string = 'bi bi-calendar2';
  public titulo2: string = 'Horarios';
  public icono2: string = 'bi bi-calendar-check';
  public titulo3: string = 'Datos del Horario';
  public icono3: string = 'bi bi-card-checklist';
  public horarioForm!: FormGroup;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public areas: Area[] = [];
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
  public aulanombre: string = "";
  public nivelnombre: string = "";
  public gradonombre: string = "";
  public seccionnombre: string = "";

  constructor( private fb: FormBuilder,
    private periodoService: PeriodoService, private aulaService: AulaService,
    private areaService: AreaService, private usuarioService: UsuarioService,
    private horarioService: HorarioService, private horaService: HoraService,
    private route: ActivatedRoute, private institucionService: InstitucionService) {


    if (this.usuarioService.usuario.role.nombre === "ADMINISTRADOR") {
      this.dias = this.horarioService.dias;
      this.periodoService.todo().subscribe({
        next: ({ ok, periodos }) => {
          if (ok) {
            this.periodos = periodos;
          }
        }
      });
      this.aulaService.todo().subscribe({
        next: ({ ok, aulas }) => {
          if (ok) {
            this.aulas = aulas;
          }
        }
      });
      this.areaService.todo().subscribe({
        next: ({ ok, areas }) => {
          if (ok) {
            this.areas = areas;
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

      this.aulaService.obtener(Number(this.route.snapshot.paramMap.get('id')))
        .subscribe({
          next: ({ ok, aula }) => {
            if (ok) {
              this.aulanombre = aula.nombre;
              this.nivelnombre = aula.nivel.nombre;
              this.gradonombre = aula.grado.nombre;
              this.seccionnombre = aula.seccion.nombre;
              this.horarioForm.controls['aulaId'].setValue(aula.id);
            }
          }
        });
      this.institucion = this.institucionService.institucion;
    }
  }

  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required]
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
      this.horarioService.horariosPeriodoAula(
        Number(arrperiodos[0]),
        Number(this.horarioForm.get('aulaId')?.value))
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
                    areaId: resultado.areaId,
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
      areaId: 0,
      programacionId: 0,
      programacion: ""
    };
    vector.forEach(item => {
      if (item.dia === dia && item.horaId === hora) {
        retorno = {
          id: item.id,
          areaId: item.programacion.area?.id,
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
      let nombreArchivo = 'HORARIO: ' + moment().format('DD/MM/yyyy') + '.pdf';
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
                      { text: this.datos[intervalo.inicio].programacion?.area?.nombre || { text: 'RECREO',bold: true, fontSize: 10}, alignment: 'center',fontSize: 10 },
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 1].programacion?.area?.nombre || { text: 'RECREO',bold: true, fontSize: 10}, alignment: 'center',fontSize: 10 },
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 2].programacion?.area?.nombre || { text: 'RECREO',bold: true, fontSize: 10}, alignment: 'center',fontSize: 10 },
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 3].programacion?.area?.nombre || { text: 'RECREO',bold: true, fontSize: 10}, alignment: 'center',fontSize: 10 },
                    ],
                    [
                      { text: this.datos[intervalo.inicio + 4].programacion?.area?.nombre || { text: 'RECREO',bold: true, fontSize: 10}, alignment: 'center',fontSize: 10 },
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
