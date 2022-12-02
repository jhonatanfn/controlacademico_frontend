import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Periodo } from 'src/app/models/periodo.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { AulaService } from 'src/app/services/aula.service';
import { Aula } from 'src/app/models/aula.model';
import { Docente } from 'src/app/models/docente.model';
import { RangoService } from 'src/app/services/rango.service';
import { Rango } from 'src/app/models/rango.model';
import { AreaService } from 'src/app/services/area.service';
import { Area } from 'src/app/models/area.model';
import { NotaService } from 'src/app/services/nota.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { CompetenciaService } from 'src/app/services/competencia.service';
import { Competencia } from 'src/app/models/competencia.model';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-nota-area-total',
  templateUrl: './reporte-nota-area-total.component.html',
  styleUrls: ['./reporte-nota-area-total.component.css']
})
export class ReporteNotaAreaTotalComponent implements OnInit {

  public titulo: string = 'Buscar';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Resultado';
  public icono2: string = 'bi bi-pin-angle';
  public titulo3: string = 'Datos Reporte';
  public icono3: string = 'bi bi-card-checklist';
  public titulo4: string = 'Promedios por SubArea';
  public icono4: string = 'bi bi-calculator-fill';
  public repForm!: FormGroup;
  public periodos: Periodo[] = [];
  public ciclos: Ciclo[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  @ViewChild('htmlData') htmlData!: ElementRef;
  public institucion!: Institucion;
  public aulas: Aula[] = [];
  public areas: Area[] = [];
  public rangos: Rango[] = [];
  public docente!: Docente;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public areanombre: string = "";
  public ciclonombre: string = "";
  public docentenombre: string = "";
  public alumnonombre: string = "";
  public matriculadetalles: Matriculadetalle[] = [];
  public cargando: boolean = false;
  public competencias: Competencia[] = [];

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
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
  };

  constructor(private fb: FormBuilder,
    private cicloService: CicloService, private periodoService: PeriodoService,
    private matriculadetalleService: MatriculadetalleService, private areaService: AreaService,
    private institucionService: InstitucionService, private notaService: NotaService,
    private aulaService: AulaService, private competenciaService: CompetenciaService,
    private rangoService: RangoService) {

    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });
    this.cicloService.listar().subscribe(({ ok, ciclos }) => {
      if (ok) {
        this.ciclos = ciclos;
      }
    });
    this.rangoService.todo().subscribe(({ ok, rangos }) => {
      if (ok) {
        this.rangos = rangos;
      }
    });
    this.areaService.todo().subscribe({
      next: ({ ok, areas }) => {
        if (ok) {
          this.areas = areas;
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
    this.repForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      areaId: ['', Validators.required],
      cicloId: ['', Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.repForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  cargarMatriculas() {
    let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
    let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
    let arrAreas = (this.repForm.get('areaId')?.value).split(',');
    if (arrPeriodos[0] && arrAulas[0] && arrAreas[0]) {
      this.matriculadetalleService.matriculadetallesPeriodoAulaArea(arrPeriodos[0],
        arrAulas[0], arrAreas[0]).subscribe({
          next: ({ ok, matriculadetalles }) => {
            if (ok) {
              this.matriculadetalles = matriculadetalles;
              this.competenciaService.competenciasArea(arrAreas[0]).subscribe({
                next: ({ ok, competencias }) => {
                  if (ok) {
                    this.competencias = competencias;
                  }
                }
              });
            }
          }
        });
    }
  }
  generarBarras() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    let arrayLista: any[] = [];
    this.rangos.forEach(rango => {
      let label = rango.situacion;
      let objeto = {
        rango: rango,
        total: 0,
        porcentaje: 0
      }
      arrayLista.push(objeto);
      etiquetas.push(label);
    });

    this.datos.forEach(dato => {
      arrayLista.forEach(item => {
        if (item.rango.inicio <= dato.promedioarea && item.rango.fin >= dato.promedioarea) {
          item.total = item.total + 1;
          item.porcentaje = Math.round((item.total / this.datos.length) * 100);
        }
      });
    });

    arrayLista.forEach(item => {
      let label = item.porcentaje;
      datas.push(label);
    });
    this.salesData = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Porcentajes',
          backgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green
          ],
          hoverBackgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green
          ],
          hoverBorderColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green
          ],
          hoverBorderWidth: 2,
          data: datas,
          tension: 0.5
        },
      ],
    }
  }


  buscarNotas() {
    this.formSubmitted = true;
    if (this.repForm.valid) {
      this.datos = [];
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrAreas = (this.repForm.get('areaId')?.value).split(',');
      let arrciclos = (this.repForm.get('cicloId')?.value).split(',');
      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.areanombre = arrAreas[1];
      this.ciclonombre = arrciclos[1];
      this.cargando = true;

      this.matriculadetalles.forEach(matriculadetalle => {
        this.notaService.notasPeriodoAulaAreaCicloAlumno(arrPeriodos[0], arrAulas[0], arrAreas[0],
          arrciclos[0], Number(matriculadetalle.matricula?.alumno?.id)).subscribe({
            next: ({ ok, notas }) => {
              if (ok) {
                let objeto = {
                  alumno: matriculadetalle,
                  notas: notas
                };
                this.datos.push(objeto);
              }
            }
          });
      });
      this.cargando = false;
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

    if (this.repForm.valid) {
      let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
      let nombreArchivo = 'REPORTE: ' + moment().format('DD/MM/yyyy') + '.pdf';
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrAreas = (this.repForm.get('areaId')?.value).split(',');
      let arrciclos = (this.repForm.get('cicloId')?.value).split(',');

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
            text: 'REPORTE DE NOTAS',
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
              { text: 'AULA: ', bold: true, }, arrAulas[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'AREA: ', bold: true, }, arrAreas[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'CICLO: ', bold: true, }, arrciclos[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'FECHA REPORTE: ', bold: true, }, moment().format('DD/MM/yyyy')
            ],
            fontSize: 12,
            color: '#0000',
            margin: [0, 1, 0, 5],
          },
          {
            margin: [0, 1, 0, 5],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'ALUMNO', bold: true, alignment: 'center' },
                  { text: '', bold: true, alignment: 'center' }
                ],
                ...this.datos.map(p => (
                  [
                    this.datos.indexOf(p) + 1,
                    p.alumno.matricula?.alumno?.persona?.apellidopaterno + ' ' +
                    p.alumno.matricula?.alumno?.persona?.apellidomaterno + ' ' +
                    p.alumno.matricula?.alumno?.persona?.nombres,
                    [
                      {
                        margin: [0, 1, 0, 1],
                        table: {
                          body: [
                            [
                              { text: 'Fecha', bold: true },
                              { text: 'Competencia', bold: true },
                              { text: 'Evaluación', bold: true },
                              { text: 'Valor', bold: true }
                            ],
                            ...p.notas.map((nt: any) => (
                              [
                                moment(nt.fecha).format('DD/MM/yyyy'),
                                nt.competencia?.descripcion,
                                nt.evaluacion?.nombre,
                                nt.valor
                              ]
                            ))
                          ]
                        },
                      },
                    ]
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
