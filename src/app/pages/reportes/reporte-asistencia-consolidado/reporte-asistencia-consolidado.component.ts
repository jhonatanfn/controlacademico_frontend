import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Aula } from 'src/app/models/aula.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Nota } from 'src/app/models/nota.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Rango } from 'src/app/models/rango.model';
import { Situacion } from 'src/app/models/situacion.model';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AulaService } from 'src/app/services/aula.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { SituacionService } from 'src/app/services/situacion.service';

@Component({
  selector: 'app-reporte-asistencia-consolidado',
  templateUrl: './reporte-asistencia-consolidado.component.html',
  styleUrls: ['./reporte-asistencia-consolidado.component.css']
})
export class ReporteAsistenciaConsolidadoComponent implements OnInit {

  public titulo: string = 'Buscar';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Resultado';
  public icono2: string = 'bi bi-pin-angle';
  public titulo3: string = 'Datos Reporte';
  public icono3: string = 'bi bi-bookmark';
  public formTipos!: FormGroup;
  public formSubmitted: boolean = false;
  public cargando: boolean = false;
  @ViewChild('closebutton') closebutton: any;
  public tipos: any[] = [
    {
      id: 1,
      codigo: "P",
      descripcion: "PERIODO",
      periodo: 1,
      aula: 0,
      rango: 0,
      alumno: 0
    },
    {
      id: 2,
      codigo: "PA",
      descripcion: "PERIODO-AULA",
      periodo: 1,
      aula: 1,
      rango: 0,
      alumno: 0
    },
    {
      id: 3,
      codigo: "PAR",
      descripcion: "PERIODO-AULA-RANGO",
      periodo: 1,
      aula: 1,
      rango: 1,
      alumno: 0
    },
    {
      id: 4,
      codigo: "PARA",
      descripcion: "PERIODO-AULA-RANGO-ALUMNO",
      periodo: 1,
      aula: 1,
      rango: 1,
      alumno: 1
    },
  ];
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public matriculadetalles: Matriculadetalle[] = [];
  public notas: Nota[] = [];
  public datos: any[] = [];
  public rangos: Rango[] = [];
  public situaciones: Situacion[] = [];

  public periodoV: boolean = false;
  public aulaV: boolean = false;
  public fechaiV: boolean = false;
  public fechafV: boolean = false;
  public alumnoV: boolean = false;

  public periodoNombre: string = "";
  public aulaNombre: string = "";
  public fechaiNombre: string = "";
  public fechafNombre: string = "";
  public alumnoNombre: string = "";
  public totalprocesados: string = "";
  public institucion!: Institucion;
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

  constructor(private fb: FormBuilder, private periodoService: PeriodoService,
    private aulaService: AulaService, private matriculadetalleService: MatriculadetalleService,
    private institucionService: InstitucionService, private situacionService: SituacionService,
    private asistenciaService: AsistenciaService) {

    this.institucion = this.institucionService.institucion;

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

    this.situacionService.todo().subscribe({
      next: ({ ok, situaciones }) => {
        if (ok) {
          this.situaciones = situaciones;
        }
      }
    });
  }

  ngOnInit(): void {
    this.formTipos = this.fb.group({
      tipoid: [''],
      periodoid: ['', Validators.required],
      aulaid: ['', Validators.required],
      fechainicial: ['', Validators.required],
      fechafinal: ['', Validators.required],
      alumnoid: ['', Validators.required]
    });
  }

  generarBarras() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    this.situaciones.forEach(situacion => {
      let label = situacion.nombre;
      etiquetas.push(label);
    });
    this.datos.forEach(dato => {
      let label = dato.porcentaje;
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
        },

      ],
    }
  }

  campoRequerido(campo: string) {
    if (this.formTipos.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  seleccionReporte() {
    if (this.formTipos.get('tipoid')?.value == 1) {
      this.periodoV = true;
      this.aulaV = false;
      this.fechaiV = false;
      this.fechafV = false;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 2) {
      this.periodoV = true;
      this.aulaV = true;
      this.fechaiV = false;
      this.fechafV = false;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 3) {
      this.periodoV = true;
      this.aulaV = true;
      this.fechaiV = true;
      this.fechafV = true;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 4) {
      this.periodoV = true;
      this.aulaV = true;
      this.fechaiV = true;
      this.fechafV = true;
      this.alumnoV = true;
    }
  }

  cargarAlumnos() {
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    
    if (Number(arrPeriodos[0]) && Number(arrAulas[0])) {
      this.matriculadetalleService.matriculadetallesPeriodoAula(
        Number(arrPeriodos[0]),
        Number(arrAulas[0])).subscribe({
          next: ({ ok, matriculadetalles }) => {
            if (ok) {
              this.matriculadetalles = matriculadetalles;
              this.formTipos.controls['alumnoid'].setValue("");
            }
          }
        });
    } else {
      this.matriculadetalles = [];
    }
  }

  validarSeleccion(t: number) {
    switch (t) {
      case 1:
        this.formTipos.controls['aulaid'].setErrors(null);
        this.formTipos.controls['fechainicial'].setErrors(null);
        this.formTipos.controls['fechafinal'].setErrors(null);
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
      case 2:
        this.formTipos.controls['fechainicial'].setErrors(null);
        this.formTipos.controls['fechafinal'].setErrors(null);
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
      case 3:
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
    }

  }

  buscarNotas() {
    this.formSubmitted = true;
    this.datos = [];
    let tiposeleccionado = Number(this.formTipos.get('tipoid')?.value);
    this.validarSeleccion(tiposeleccionado);
    if (this.formTipos.valid) {

      switch (tiposeleccionado) {
        case 1:
          this.listarAsistenciasPeriodo();
          break;
        case 2:
          this.listarAsistenciasPeriodoAula();
          break;
        case 3:
          this.listarAsistenciasPeriodoAulaRango();
          break;
        case 4:
          this.listarAsistenciasPeriodoAulaRangoAlumno();
          break;
      }
    }
  }

  listarAsistenciasPeriodoAulaRangoAlumno() {
    this.datos = [];
    this.cargando = true;
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    let arrAlumnos = (this.formTipos.get('alumnoid')?.value).split(',');

    this.asistenciaService.asistenciasPeriodoAulaRangoAlumno(
      arrPeriodos[0],
      arrAulas[0],
      this.formTipos.get('fechainicial')?.value,
      this.formTipos.get('fechafinal')?.value,
      arrAlumnos[0]
    ).subscribe({
      next: ({ ok, asistencias }) => {
        if (ok) {
          if (asistencias.length > 0) {
            let totalNotas = asistencias.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = arrAulas[1];
            this.fechaiNombre = moment(this.formTipos.get('fechainicial')?.value).format('DD/MM/yyyy');
            this.fechafNombre = moment(this.formTipos.get('fechafinal')?.value).format('DD/MM/yyyy');
            this.alumnoNombre = asistencias[0].matriculadetalle?.matricula?.alumno?.persona?.nombres + ' ' +
              asistencias[0].matriculadetalle?.matricula?.alumno?.persona?.apellidopaterno + ' ' +
              asistencias[0].matriculadetalle?.matricula?.alumno?.persona?.apellidomaterno;

            this.totalprocesados = String(totalNotas);

            this.situaciones.forEach(situacion => {
              let objeto = {
                situacion: situacion,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });

            asistencias.forEach(asistencia => {
              this.datos.forEach(dato => {
                if (dato.situacion.nombre == asistencia.situacion?.nombre) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
          }
          this.cargando = false;
        }
      }
    });
  }

  listarAsistenciasPeriodoAulaRango() {
    this.datos = [];
    this.cargando = true;
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
  
    this.asistenciaService.asistenciasPeriodoAulaRango(arrPeriodos[0], arrAulas[0], 
      this.formTipos.get('fechainicial')?.value,
      this.formTipos.get('fechafinal')?.value
      ).subscribe({
      next: ({ ok, asistencias }) => {
        if (ok) {
          if (asistencias.length > 0) {
            let totalNotas = asistencias.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = arrAulas[1];
            this.fechaiNombre = moment(this.formTipos.get('fechainicial')?.value).format('DD/MM/yyyy');
            this.fechafNombre = moment(this.formTipos.get('fechafinal')?.value).format('DD/MM/yyyy');
            this.alumnoNombre = "Todos";
            this.totalprocesados = String(totalNotas);

            this.situaciones.forEach(situacion => {
              let objeto = {
                situacion: situacion,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });

            asistencias.forEach(asistencia => {
              this.datos.forEach(dato => {
                if (dato.situacion.nombre == asistencia.situacion?.nombre) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
          }
          this.cargando = false;
        }
      }
    });
  }

  listarAsistenciasPeriodoAula() {
    this.datos = [];
    this.cargando = true;
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    this.asistenciaService.asistenciasPeriodoAula(arrPeriodos[0], arrAulas[0]).subscribe({
      next: ({ ok, asistencias }) => {
        if (ok) {
          if (asistencias.length > 0) {
            let totalNotas = asistencias.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = arrAulas[1];
            this.fechaiNombre = "Todos",
              this.fechafNombre = "Todos";
            this.alumnoNombre = "Todos";
            this.totalprocesados = String(totalNotas);

            this.situaciones.forEach(situacion => {
              let objeto = {
                situacion: situacion,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });

            asistencias.forEach(asistencia => {
              this.datos.forEach(dato => {
                if (dato.situacion.nombre == asistencia.situacion?.nombre) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
          }
          this.cargando = false;
        }
      }
    });
  }

  listarAsistenciasPeriodo() {
    this.datos = [];
    this.cargando = true;
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    this.asistenciaService.asistenciasPeriodo(arrPeriodos[0]).subscribe({
      next: ({ ok, asistencias }) => {
        if (ok) {
          if (asistencias.length > 0) {
            let totalNotas = asistencias.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = "Todos";
            this.fechaiNombre = "Todos",
              this.fechafNombre = "Todos";
            this.alumnoNombre = "Todos";
            this.totalprocesados = String(totalNotas);

            this.situaciones.forEach(situacion => {
              let objeto = {
                situacion: situacion,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });

            asistencias.forEach(asistencia => {
              this.datos.forEach(dato => {
                if (dato.situacion.nombre == asistencia.situacion?.nombre) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
          }
          this.cargando = false;
        }
      }
    });
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

    if (this.formTipos.valid) {
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
              { text: 'PERIODO: ', bold: true }, this.periodoNombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'AULA: ', bold: true, }, this.aulaNombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'ALUMNO: ', bold: true, }, this.alumnoNombre
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'FECHA REPORTE : ', bold: true, }, moment().format('DD/MM/yyyy')
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 1],
          },


          {
            //layout: 'lightHorizontalLines',
            margin: [0, 10, 0, 15],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  { text: 'TOTAL', bold: true, alignment: 'center' },
                  { text: '%', bold: true, alignment: 'center' },
                ],
                ...this.datos.map(p => (
                  [
                    this.datos.indexOf(p) + 1,
                    p.situacion.nombre,
                    p.total,
                    p.porcentaje,
                  ])),
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
