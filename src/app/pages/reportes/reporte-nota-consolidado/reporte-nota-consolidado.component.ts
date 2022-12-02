import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Area } from 'src/app/models/area.model';
import { Aula } from 'src/app/models/aula.model';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Nota } from 'src/app/models/nota.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Rango } from 'src/app/models/rango.model';
import { AreaService } from 'src/app/services/area.service';
import { AulaService } from 'src/app/services/aula.service';
import { CicloService } from 'src/app/services/ciclo.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { NotaService } from 'src/app/services/nota.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { RangoService } from 'src/app/services/rango.service';

@Component({
  selector: 'app-reporte-nota-consolidado',
  templateUrl: './reporte-nota-consolidado.component.html',
  styleUrls: ['./reporte-nota-consolidado.component.css']
})
export class ReporteNotaConsolidadoComponent implements OnInit {

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
      area: 0,
      ciclo: 0,
      alumno: 0
    },
    {
      id: 2,
      codigo: "PA",
      descripcion: "PERIODO-AULA",
      periodo: 1,
      aula: 1,
      area: 0,
      ciclo: 0,
      alumno: 0
    },
    {
      id: 3,
      codigo: "PAA",
      descripcion: "PERIODO-AULA-AREA",
      periodo: 1,
      aula: 1,
      area: 1,
      ciclo: 0,
      alumno: 0
    },
    {
      id: 4,
      codigo: "PAAC",
      descripcion: "PERIODO-AULA-AREA-CICLO",
      periodo: 1,
      aula: 1,
      area: 1,
      ciclo: 1,
      alumno: 0
    },
    {
      id: 5,
      codigo: "PAACA",
      descripcion: "PERIODO-AULA-AREA-CICLO-ALUMNO",
      periodo: 1,
      aula: 1,
      area: 1,
      ciclo: 1,
      alumno: 1
    },
  ];
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public areas: Area[] = [];
  public ciclos: Ciclo[] = [];
  public matriculadetalles: Matriculadetalle[] = [];
  public notas: Nota[] = [];
  public datos: any[] = [];
  public rangos: Rango[] = [];
  public periodoV: boolean = false;
  public aulaV: boolean = false;
  public areaV: boolean = false;
  public subareaV: boolean = false;
  public cicloV: boolean = false;
  public alumnoV: boolean = false;
  public periodoNombre: string = "";
  public aulaNombre: string = "";
  public areaNombre: string = "";
  public subareaNombre: string = "";
  public cicloNombre: string = "";
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

  public literales: any[] = [];
  public vigesimales: any[] = [];
  public literalactivo: boolean = false;
  public vigesimalactivo: boolean = false;

  constructor(private fb: FormBuilder, private periodoService: PeriodoService,
    private aulaService: AulaService, private areaService: AreaService,
    private cicloService: CicloService, private notaService: NotaService,
    private rangoService: RangoService, private institucionService: InstitucionService,
    private matriculadetalleService: MatriculadetalleService) {

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
    this.areaService.todo().subscribe({
      next: ({ ok, areas }) => {
        if (ok) {
          this.areas = areas;
        }
      }
    });
    this.cicloService.listar().subscribe({
      next: ({ ok, ciclos }) => {
        if (ok) {
          this.ciclos = ciclos;
        }
      }
    });
    this.rangoService.todo().subscribe({
      next: ({ ok, rangos }) => {
        if (ok) {
          this.rangos = rangos;
        }
      }
    });
  }

  ngOnInit(): void {
    this.formTipos = this.fb.group({
      tipoid: [''],
      periodoid: ['', Validators.required],
      aulaid: ['', Validators.required],
      areaid: ['', Validators.required],
      cicloid: ['', Validators.required],
      alumnoid: ['', Validators.required]
    });
  }

  generarBarras() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    let label="";
    this.rangos.forEach(rango => {
      if(this.literalactivo && this.vigesimalactivo==false){
        label = rango.letra;
      }
      if(this.vigesimalactivo && this.literalactivo== false){
        if(rango.inicio<=20){
          label = rango.inicio + ' - ' + rango.fin;
        }else{
          label = "-"
        }
      }
      if(this.vigesimalactivo && this.literalactivo){
        if(rango.inicio<=20){
          label = rango.inicio + ' - ' + rango.fin+' / '+rango.letra;
        }else{
          label ="-"
        }
      }
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
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green,
            this.chartColors.grey
          ],
          hoverBackgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green,
            this.chartColors.grey
          ],
          hoverBorderColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green,
            this.chartColors.grey
          ],
          hoverBorderWidth: 2,
          data: datas,
          tension: 0.5
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
      this.areaV = false;
      this.cicloV = false;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 2) {
      this.periodoV = true;
      this.aulaV = true;
      this.areaV = false;
      this.cicloV = false;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 3) {
      this.periodoV = true;
      this.aulaV = true;
      this.areaV = true;
      this.cicloV = false;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 4) {
      this.periodoV = true;
      this.aulaV = true;
      this.areaV = true;
      this.cicloV = true;
      this.alumnoV = false;
    }
    if (this.formTipos.get('tipoid')?.value == 5) {
      this.periodoV = true;
      this.aulaV = true;
      this.areaV = true;
      this.cicloV = true;
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
        this.formTipos.controls['areaid'].setErrors(null);
        this.formTipos.controls['cicloid'].setErrors(null);
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
      case 2:
        this.formTipos.controls['areaid'].setErrors(null);
        this.formTipos.controls['cicloid'].setErrors(null);
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
      case 3:
        this.formTipos.controls['cicloid'].setErrors(null);
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
      case 4:
        this.formTipos.controls['alumnoid'].setErrors(null);
        break;
    }

  }

  buscarNotas() {
    this.formSubmitted = true;
    let tiposeleccionado = Number(this.formTipos.get('tipoid')?.value);
    this.validarSeleccion(tiposeleccionado);
    this.datos = [];
    if (this.formTipos.valid) {
      switch (tiposeleccionado) {
        case 1:
          this.listarNotasPeriodo();
          break;
        case 2:
          this.listarNotasPeriodoAula();
          break;
        case 3:
          this.listarNotasPeriodoAulaArea();
          break;
        case 4:
          this.listarNotasPeriodoAulaAreaCiclo();
          break;
        case 5:
          this.listarNotasPeriodoAulaAreaCicloAlumno();
          break;
      }
    }
  }

  listarNotasPeriodoAulaAreaCicloAlumno() {
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    let arrAreas = (this.formTipos.get('areaid')?.value).split(',');
    let arrCiclos = (this.formTipos.get('cicloid')?.value).split(',');
    let arrAlumnos = (this.formTipos.get('alumnoid')?.value).split(',');
    this.datos = [];
    this.cargando = true;
    this.literalactivo = false;
    this.vigesimalactivo = false;
    this.notaService.notasPeriodoAulaAreaCicloAlumno(arrPeriodos[0], arrAulas[0],
      arrAreas[0], arrCiclos[0], arrAlumnos[0]).subscribe({
        next: ({ ok, notas }) => {
          if (ok) {
            if (notas.length > 0) {
              let totalNotas = notas.length;
              this.periodoNombre = arrPeriodos[1];
              this.aulaNombre = arrAulas[1];
              this.areaNombre = arrAreas[1];
              this.cicloNombre = arrCiclos[1];
              this.alumnoNombre = notas[0].matriculadetalle?.matricula?.alumno?.persona?.nombres + ' ' +
                notas[0].matriculadetalle?.matricula?.alumno?.persona?.apellidopaterno + ' ' +
                notas[0].matriculadetalle?.matricula?.alumno?.persona?.apellidomaterno;
              this.totalprocesados = String(totalNotas);

              this.rangos.forEach(rango => {
                let objeto = {
                  rango: rango,
                  total: 0,
                  porcentaje: 0
                }
                this.datos.push(objeto);
              });
              if (arrAulas[2] == 1) {
                this.literalactivo = true;
                this.vigesimalactivo = false;
                notas.forEach(nota => {
                  this.datos.forEach(dato => {
                    if (dato.rango.letra == nota.valor) {
                      dato.total = dato.total + 1;
                      dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                    }
                  });
                });
              }
              if (arrAulas[2] == 2) {
                this.literalactivo = false;
                this.vigesimalactivo = true;
                notas.forEach(nota => {
                  this.datos.forEach(dato => {
                    if (dato.rango.inicio <= nota.valor && dato.rango.fin >= nota.valor) {
                      dato.total = dato.total + 1;
                      dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                    }
                  });
                });
              }
            }
            this.cargando = false;
          }
        }
      });

  }

  listarNotasPeriodoAulaAreaCiclo() {
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    let arrAreas = (this.formTipos.get('areaid')?.value).split(',');
    let arrCiclos = (this.formTipos.get('cicloid')?.value).split(',');
    this.datos = [];
    this.cargando = true;
    this.literalactivo = false;
    this.vigesimalactivo = false;
    this.notaService.notasPeriodoAulaAreaCiclo(arrPeriodos[0], arrAulas[0],
      arrAreas[0], arrCiclos[0]).subscribe({
        next: ({ ok, notas }) => {
          if (ok) {
            if (notas.length > 0) {
              let totalNotas = notas.length;
              this.periodoNombre = arrPeriodos[1];
              this.aulaNombre = arrAulas[1];
              this.areaNombre = arrAreas[1];
              this.cicloNombre = arrCiclos[1];
              this.alumnoNombre = "Todos";
              this.totalprocesados = String(totalNotas);

              this.rangos.forEach(rango => {
                let objeto = {
                  rango: rango,
                  total: 0,
                  porcentaje: 0
                }
                this.datos.push(objeto);
              });

              if (arrAulas[2] == 1) {
                this.literalactivo = true;
                this.vigesimalactivo = false;
                notas.forEach(nota => {
                  this.datos.forEach(dato => {
                    if (dato.rango.letra == nota.valor) {
                      dato.total = dato.total + 1;
                      dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                    }
                  });
                });
              }
              if (arrAulas[2] == 2) {
                this.literalactivo = false;
                this.vigesimalactivo = true;
                notas.forEach(nota => {
                  this.datos.forEach(dato => {
                    if (dato.rango.inicio <= nota.valor && dato.rango.fin >= nota.valor) {
                      dato.total = dato.total + 1;
                      dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                    }
                  });
                });
              }

            }
            this.cargando = false;
          }
        }
      });

  }

  listarNotasPeriodoAulaArea() {
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    let arrAreas = (this.formTipos.get('areaid')?.value).split(',');
    this.datos = [];
    this.cargando = true;
    this.literalactivo = false;
    this.vigesimalactivo = false;
    this.notaService.notasPeriodoAulaArea(arrPeriodos[0], arrAulas[0], arrAreas[0]).subscribe({
      next: ({ ok, notas }) => {
        if (ok) {
          if (notas.length > 0) {
            let totalNotas = notas.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = arrAulas[1];
            this.areaNombre = arrAreas[1];
            this.cicloNombre = "Todos";
            this.alumnoNombre = "Todos";
            this.totalprocesados = String(totalNotas);

            this.rangos.forEach(rango => {
              let objeto = {
                rango: rango,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });

            if (arrAulas[2] == 1) {
              this.literalactivo = true;
              this.vigesimalactivo = false;
              notas.forEach(nota => {
                this.datos.forEach(dato => {
                  if (dato.rango.letra == nota.valor) {
                    dato.total = dato.total + 1;
                    dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                  }
                });
              });
            }
            if (arrAulas[2] == 2) {
              this.literalactivo = false;
              this.vigesimalactivo = true;
              notas.forEach(nota => {
                this.datos.forEach(dato => {
                  if (dato.rango.inicio <= nota.valor && dato.rango.fin >= nota.valor) {
                    dato.total = dato.total + 1;
                    dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                  }
                });
              });
            }
          }
          this.cargando = false;
        }
      }
    });

  }

  listarNotasPeriodoAula() {
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    let arrAulas = (this.formTipos.get('aulaid')?.value).split(',');
    this.datos = [];
    this.cargando = true;
    this.literalactivo = false;
    this.vigesimalactivo = false;
    this.notaService.notasPeriodoAula(arrPeriodos[0], arrAulas[0]).subscribe({
      next: ({ ok, notas }) => {
        if (ok) {
          if (notas.length > 0) {
            let totalNotas = notas.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = arrAulas[1];
            this.areaNombre = "Todos";
            this.subareaNombre = "Todos";
            this.cicloNombre = "Todos";
            this.alumnoNombre = "Todos";
            this.totalprocesados = String(totalNotas);

            this.rangos.forEach(rango => {
              let objeto = {
                rango: rango,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });

            if (arrAulas[2] == 1) {
              this.literalactivo = true;
              this.vigesimalactivo = false;
              notas.forEach(nota => {
                this.datos.forEach(dato => {
                  if (dato.rango.letra == nota.valor) {
                    dato.total = dato.total + 1;
                    dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                  }
                });
              });
            }
            if (arrAulas[2] == 2) {
              this.literalactivo = false;
              this.vigesimalactivo = true;
              notas.forEach(nota => {
                this.datos.forEach(dato => {
                  if (dato.rango.inicio <= nota.valor && dato.rango.fin >= nota.valor) {
                    dato.total = dato.total + 1;
                    dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                  }
                });
              });
            }
          }
          this.cargando = false;
        }
      }
    });
  }

  listarNotasPeriodo() {
    let arrPeriodos = (this.formTipos.get('periodoid')?.value).split(',');
    this.datos = [];
    this.cargando = true;
    this.literalactivo = false;
    this.vigesimalactivo = false;
    this.notaService.notasPeriodo(arrPeriodos[0]).subscribe({
      next: ({ ok, notas }) => {
        if (ok) {
          if (notas.length > 0) {
            let totalNotas = notas.length;
            this.periodoNombre = arrPeriodos[1];
            this.aulaNombre = "Todos";
            this.areaNombre = "Todos";
            this.subareaNombre = "Todos";
            this.cicloNombre = "Todos";
            this.alumnoNombre = "Todos";
            this.totalprocesados = String(totalNotas);

            this.rangos.forEach(rango => {
              let objeto = {
                rango: rango,
                total: 0,
                porcentaje: 0
              }
              this.datos.push(objeto);
            });
            this.literalactivo = true;
            this.vigesimalactivo = true;
            notas.forEach(nota => {
              this.datos.forEach(dato => {
                if (dato.rango.letra == nota.valor) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
                if (dato.rango.inicio <= nota.valor && dato.rango.fin >= nota.valor) {
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
      
      if(this.literalactivo && this.vigesimalactivo){

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
                { text: 'AREA: ', bold: true, }, this.areaNombre
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },
            {
              text: [
                { text: 'CICLO: ', bold: true, }, this.cicloNombre
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
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'RANGO', bold: true, alignment: 'center' },
                    { text: 'LETRA', bold: true, alignment: 'center' },
                    { text: 'TOTAL', bold: true, alignment: 'center' },
                    { text: '%', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.rango.inicio + ' - ' + p.rango.fin,
                      p.rango.letra,
                      p.total,
                      p.porcentaje,
                      { text: p.rango.situacion, alignment: 'center' }
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

      }

      if(this.literalactivo && this.vigesimalactivo==false){
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
                { text: 'AREA: ', bold: true, }, this.areaNombre
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },
            {
              text: [
                { text: 'CICLO: ', bold: true, }, this.cicloNombre
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
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'LETRA', bold: true, alignment: 'center' },
                    { text: 'TOTAL', bold: true, alignment: 'center' },
                    { text: '%', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.rango.letra,
                      p.total,
                      p.porcentaje,
                      { text: p.rango.situacion, alignment: 'center' }
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
      }

      if(this.literalactivo==false && this.vigesimalactivo){
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
                { text: 'AREA: ', bold: true, }, this.areaNombre
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },
            {
              text: [
                { text: 'CICLO: ', bold: true, }, this.cicloNombre
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
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'RANGO', bold: true, alignment: 'center' },
                    { text: 'TOTAL', bold: true, alignment: 'center' },
                    { text: '%', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.rango.inicio + ' - ' + p.rango.fin,
                      p.total,
                      p.porcentaje,
                      { text: p.rango.situacion, alignment: 'center' }
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
      }
      
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
