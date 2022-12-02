import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Periodo } from 'src/app/models/periodo.model';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ChartData, ChartOptions } from 'chart.js';
import * as  moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { Aula } from 'src/app/models/aula.model';
import { AulaService } from 'src/app/services/aula.service';
import { Docente } from 'src/app/models/docente.model';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { SituacionService } from 'src/app/services/situacion.service';
import { Situacion } from 'src/app/models/situacion.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte-asistencia-rango',
  templateUrl: './reporte-asistencia-rango.component.html',
  styleUrls: ['./reporte-asistencia-rango.component.css']
})
export class ReporteAsistenciaRangoComponent implements OnInit {

  public titulo: string = 'Buscar';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Resultado';
  public icono2: string = 'bi bi-pin-angle';
  public titulo3: string = 'Datos Reporte';
  public icono3: string = 'bi bi-bookmark';
  public asisForm!: FormGroup;
  public periodos: Periodo[] = [];
  public matriculadetalles: Matriculadetalle[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  @ViewChild('htmlData') htmlData!: ElementRef;
  public asistiototal: number = 0;
  public faltototal: number = 0;
  public justificototal: number = 0;
  public tardanzatotal: number = 0;
  public noregistrototal: number = 0;
  public total: number = 0;
  public institucion!: Institucion;
  public aulas: Aula[] = [];
  public docente!: Docente;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public fechai: string = "";
  public fechaf: string = "";
  public cargando: boolean = false;
  public situaciones: Situacion[] = [];
  public graficos:any[]=[];
  public salesData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  public chartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 2000
    },
    plugins: {
      title: {
        display: true,
        text: 'Estadísticas',
      },
    },

  };
  chartColors = {
    red: 'rgb(224, 32, 32)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(53, 138, 31)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(105, 100, 100)'
  };


  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService, private asistenciaService: AsistenciaService,
    private institucionService: InstitucionService, private aulaService: AulaService,
    private situacionService: SituacionService,private matriculadetalleService: MatriculadetalleService) {

    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });
    this.situacionService.todo().subscribe({
      next: ({ ok, situaciones }) => {
        if (ok) {
          this.situaciones = situaciones;
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

    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.asisForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      fechainicial: ['', Validators.required],
      fechafinal: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarAsistencias() {
    this.formSubmitted = true;
    if (this.asisForm.valid) {
      this.cargando = true;
      this.datos = [];
      let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.asisForm.get('aulaId')?.value).split(',');
      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.fechai = moment(this.asisForm.get('fechainicial')?.value).format('DD/MM/yyyy');;
      this.fechaf = moment(this.asisForm.get('fechafinal')?.value).format('DD/MM/yyyy');;

      this.matriculadetalleService.matriculadetallesPeriodoAula(
        Number(arrPeriodos[0]),
        Number(arrAulas[0])).subscribe({
          next: ({ ok, matriculadetalles }) => {
            if (ok) {
              this.matriculadetalles = matriculadetalles;
              this.asistenciaService.asistenciasRango(Number(arrPeriodos[0]), Number(arrAulas[0]),
                this.asisForm.get('fechainicial')?.value, this.asisForm.get('fechafinal')?.value)
                .subscribe({
                  next: ({ ok, asistencias }) => {
                    this.total = asistencias.length;
                    if (ok) {
                      let a = 0;
                      let f = 0;
                      let j = 0;
                      let t = 0;
                      let nr = 0;
                      this.matriculadetalles.forEach(matriculadetalle => {
                        a = 0; f = 0; j = 0; t = 0; nr = 0;
                        asistencias.forEach(asistencia => {
                          if (matriculadetalle.matricula?.alumno?.id == asistencia.matriculadetalle?.matricula?.alumno?.id) {
                            if (asistencia.situacion?.id == 4) {
                              f = f + 1;
                            } else {
                              if (asistencia.situacion?.id == 14) {
                                a = a + 1;
                              } else {
                                if (asistencia.situacion?.id == 24) {
                                  j = j + 1;
                                } else {
                                  if (asistencia.situacion?.id == 34) {
                                    t = t + 1;
                                  } else {
                                    nr = nr + 1;
                                  }
                                }
                              }
                            }
                          }
                        });
                        let objeto = {
                          alumno: matriculadetalle,
                          asistencia: a,
                          falta: f,
                          justifica: j,
                          tardanza: t,
                          noregistro: nr
                        };
                        this.datos.push(objeto);
                      });
                      this.calcularTotales(this.datos);
                      this.cargando = false;
                    }
                  }
                });
            }
          }
        });
    }
  }

  calcularTotales(vector: any[]) {
    this.asistiototal = 0;
    this.faltototal = 0;
    this.justificototal = 0;
    this.tardanzatotal = 0;
    this.noregistrototal = 0;

    vector.forEach(item => {
      this.asistiototal = this.asistiototal + item.asistencia;
      this.faltototal = this.faltototal + item.falta;
      this.justificototal = this.justificototal + item.justifica;
      this.tardanzatotal = this.tardanzatotal + item.tardanza;
      this.noregistrototal = this.noregistrototal + item.noregistro;
    });

    this.situaciones.forEach(situacion => {
      let objeto = {
        situacion: situacion,
        total: 0,
        porcentaje: 0
      }
      this.graficos.push(objeto);
    });
    this.graficos.forEach(grafico=>{
      if(grafico.situacion?.abreviatura=="F"){
        grafico.total= this.faltototal;
        if(this.total>0){
          grafico.porcentaje= Math.round((this.faltototal / this.total) * 100);
        }else{
          grafico.porcentaje= 0;
        }
      }else{
        if(grafico.situacion?.abreviatura=="A"){
          grafico.total= this.asistiototal;
          if(this.total>0){
            grafico.porcentaje= Math.round((this.asistiototal / this.total) * 100);
          }else{
            grafico.porcentaje=0;
          }
        }else{
          if(grafico.situacion?.abreviatura=="J"){
            grafico.total= this.justificototal;
            if(this.total>0){
              grafico.porcentaje= Math.round((this.justificototal / this.total) * 100);
            }else{
              grafico.porcentaje=0;
            }
          }else{
            if(grafico.situacion?.abreviatura=="T"){
              grafico.total= this.tardanzatotal;
              if(this.total>0){
                grafico.porcentaje= Math.round((this.tardanzatotal / this.total) * 100);
              }else{
                grafico.porcentaje=0;
              }
            }else{
              grafico.total= this.noregistrototal;
              if(this.total>0){
                grafico.porcentaje= Math.round((this.noregistrototal / this.total) * 100);
              }else{
                grafico.porcentaje=0;
              }
            }
          }
        }
      }
    });
  }

  generarBarras() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    this.situaciones.forEach(situacion => {
      let label = situacion.nombre;
      etiquetas.push(label);
    });
    this.graficos.forEach(grafico => {
      let label = grafico.porcentaje;
      datas.push(label);
    });
    this.salesData = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Porcentajes',
          backgroundColor: [
            this.chartColors.red,
            this.chartColors.green,
            this.chartColors.blue,
            this.chartColors.yellow,
            this.chartColors.grey
          ],
          hoverBackgroundColor: [
            this.chartColors.red,
            this.chartColors.green,
            this.chartColors.blue,
            this.chartColors.yellow,
            this.chartColors.grey
          ],
          hoverBorderColor: [
            this.chartColors.red,
            this.chartColors.green,
            this.chartColors.blue,
            this.chartColors.yellow,
            this.chartColors.grey
          ],
          hoverBorderWidth: 2,
          data: datas,
          tension: 0.5,
        }
      ],
    }
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

      let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.asisForm.get('aulaId')?.value).split(',');

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
              { text: 'PERIODO: ', bold: true, }, arrPeriodos[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'RANGO : ', bold: true, }, 'DESDE: ' + moment(this.asisForm.get('fechainicial')?.value).format('DD/MM/yyyy') + ' HASTA: ' + moment(this.asisForm.get('fechafinal')?.value).format('DD/MM/yyyy')
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'FECHA : ', bold: true, }, moment(this.asisForm.get('fecha')?.value).format('DD/MM/yyyy')
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 1],
          },

          {
            margin: [0, 10, 0, 15],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto','auto','auto'],
              body: [
                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'APELLIDOS Y NOMBRES', bold: true, alignment: 'center' },
                  { text: 'AULA', bold: true, alignment: 'center' },
                  { text: 'A', bold: true, alignment: 'center' },
                  { text: 'F', bold: true, alignment: 'center' },
                  { text: 'J', bold: true, alignment: 'center' },
                  { text: 'T', bold: true, alignment: 'center' },
                  { text: 'NR', bold: true, alignment: 'center' },
                ],
                ...this.datos.map(p => (
                  [
                    this.datos.indexOf(p) + 1,
                    p.alumno.matricula?.alumno?.persona?.apellidopaterno+' '+
                    p.alumno.matricula?.alumno?.persona?.apellidopaterno+' '+
                    p.alumno.matricula?.alumno?.persona?.apellidomaterno,
                    p.alumno.programacion?.aula?.nombre,
                    p.asistencia,
                    p.falta,
                    p.justifica,
                    p.tardanza,
                    p.noregistro
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
           
            margin: [0, 1, 0, 5],
            table:{
              widths: ['auto', 'auto','auto'],
              body: [
                [
                  'ASISTENCIAS: ', this.asistiototal, (this.asistiototal/this.total)*100+' % '
                ],
                [
                  'FALTAS: ', this.faltototal,(this.faltototal/this.total)*100+' % '
                ],
                [
                  'JUSTIFICACIONES: ', this.justificototal,(this.justificototal/this.total)*100+' % '
                ],
                [
                  'TARDANZAS: ', this.tardanzatotal,(this.tardanzatotal/this.total)*100+' % '
                ],
                [
                  'NO REGISTRADOS: ', this.noregistrototal,(this.noregistrototal/this.total)*100+' % '
                ]
              ],
            }
          }
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
