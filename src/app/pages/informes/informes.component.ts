import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Periodo } from 'src/app/models/periodo.model';
import { PeriodoService } from 'src/app/services/periodo.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as  moment from 'moment';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { AulaService } from 'src/app/services/aula.service';
import { Aula } from 'src/app/models/aula.model';
import { Rango } from 'src/app/models/rango.model';
import { RangoService } from 'src/app/services/rango.service';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { NotaService } from 'src/app/services/nota.service';
import { AreaService } from 'src/app/services/area.service';
import { Area } from 'src/app/models/area.model';
import { ApreciacionService } from 'src/app/services/apreciacion.service';
import { ApreciaciondetalleService } from 'src/app/services/apreciaciondetalle.service';
import { Apreciaciondetalle } from 'src/app/models/apreciaciondetalle';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  public titulo: string = 'Buscar';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Resumen';
  public icono2: string = 'bi bi-bookmark';
  public titulo3: string = 'Resultado';
  public icono3: string = 'bi bi-pin-angle';
  public matriculadetalles: Matriculadetalle[] = [];
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public cargando: boolean = false;
  public areas: Area[] = [];
  public datos: any[] = [];
  public alumnonombre: string = "";
  public repForm!: FormGroup;
  public rangos: Rango[] = [];
  public formSubmitted: boolean = false;
  public institucion!: Institucion;
  public resumenes: any[] = [];
  public tipovalor: number = 0;
  public apreciaciondetalles: Apreciaciondetalle[] = [];

  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService,
    private matriculadetalleService: MatriculadetalleService,
    private areaService: AreaService,
    private institucionService: InstitucionService,
    private aulaService: AulaService, private notaService: NotaService,
    private rangoService: RangoService, private apreciacionService: ApreciacionService,
    private apreciaciondetalleService: ApreciaciondetalleService) {

    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });

    this.rangoService.todo().subscribe(({ ok, rangos }) => {
      if (ok) {
        this.rangos = rangos;
      }
    });
    this.aulaService.todo().subscribe({
      next: ({ ok, aulas }) => {
        if (ok) {
          this.aulas = aulas;
        }
      }
    });
    this.areaService.listaAreasCompetencias().subscribe({
      next: ({ ok, areas }) => {
        if (ok) {
          this.areas = areas;
        }
      }
    });
    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.repForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      alumnoId: ['', Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.repForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  cargarAlumnos() {
    this.datos = [];
    if (this.repForm.get('periodoId')?.value && this.repForm.get('aulaId')?.value) {
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      this.matriculadetalleService.matriculadetallesPeriodoAula(arrPeriodos[0], arrAulas[0])
        .subscribe({
          next: ({ ok, matriculadetalles }) => {
            if (ok) {
              this.matriculadetalles = matriculadetalles;
              this.repForm.controls['alumnoId'].setValue("");
            }
          }
        });
    }
  }
  buscarNotas() {
    this.formSubmitted = true;
    this.datos = [];
    this.apreciaciondetalles = [];
    this.resumenes = [];
    this.cargando = true;
    if (this.repForm.valid) {
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrAlumnos = (this.repForm.get('alumnoId')?.value).split(',');

      this.areas.forEach(area => {
        let objeto = {
          area: area,
          competencias: this.retornaCompetencias(area)
        };
        this.datos.push(objeto);
      });

      this.apreciaciondetalleService.apreciaciondetallesPeriodoAlumno(arrPeriodos[0], arrAlumnos[0]).subscribe({
        next: ({ ok, apreciaciondetalles }) => {
          if (ok) {
            this.apreciaciondetalles = apreciaciondetalles;
          }
        }
      });
      this.notaService.notasPeriodoAulaAlumno(arrPeriodos[0], arrAulas[0], arrAlumnos[0])
        .subscribe({
          next: ({ ok, notas }) => {
            if (ok) {
              if (notas.length > 0) {
                this.tipovalor = Number(notas[0].matriculadetalle?.programacion?.aula?.tipovalor);
                if (this.tipovalor == 1) {
                  this.retornaLogroLiteral(notas);
                  this.generarResumenLiteral();
                }
                if (this.tipovalor == 2) {
                  this.retornaLogroVigesimal(notas);
                  this.generarResumenVigesimal();
                }
              }
            }
          }
        });

      this.cargando = false;
    }
  }

  generarResumenLiteral() {
    let objeto = {};
    this.rangos.forEach(rango => {
      if (rango.letra != "-") {
        objeto = {
          rango: rango,
          total1: 0,
          total2: 0,
          total3: 0,
          total4: 0
        };
        this.resumenes.push(objeto);
      }
    });
    this.datos.forEach(dato => {
      let competencias: any[] = dato.competencias;
      competencias.forEach(competencia => {
        this.resumenes.forEach(resumen => {
          if (resumen.rango.letra == competencia.logro1) {
            resumen.total1 = resumen.total1 + 1;
          }
          if (resumen.rango.letra == competencia.logro2) {
            resumen.total2 = resumen.total2 + 1;
          }
          if (resumen.rango.letra == competencia.logro3) {
            resumen.total3 = resumen.total3 + 1;
          }
          if (resumen.rango.letra == competencia.logro4) {
            resumen.total4 = resumen.total4 + 1;
          }
        });
      });
    });
  }

  generarResumenVigesimal() {
    let objeto = {};
    this.rangos.forEach(rango => {
      if (rango.fin <= 20) {
        objeto = {
          rango: rango,
          total1: 0,
          total2: 0,
          total3: 0,
          total4: 0
        };
        this.resumenes.push(objeto);
      }
    });
    this.datos.forEach(dato => {
      let competencias: any[] = dato.competencias;
      competencias.forEach(competencia => {

        this.resumenes.forEach(resumen => {
          if (resumen.rango.inicio <= competencia.logro1 && resumen.rango.fin >= competencia.logro1) {
            resumen.total1 = resumen.total1 + 1;
          }
          if (resumen.rango.inicio <= competencia.logro2 && resumen.rango.fin >= competencia.logro2) {
            resumen.total2 = resumen.total2 + 1;
          }
          if (resumen.rango.inicio <= competencia.logro3 && resumen.rango.fin >= competencia.logro3) {
            resumen.total3 = resumen.total3 + 1;
          }
          if (resumen.rango.inicio <= competencia.logro4 && resumen.rango.fin >= competencia.logro4) {
            resumen.total4 = resumen.total4 + 1;
          }
        });
      });
    });
  }

  retornaLogroLiteral(notas: any[]) {
    this.datos.forEach(dato => {
      let competencias: any[] = dato.competencias;
      competencias.forEach(competencia => {
        competencia.logro1 = this.calcularNivel(notas, 4, competencia.competencia.id);
        competencia.logro2 = this.calcularNivel(notas, 14, competencia.competencia.id);
        competencia.logro3 = this.calcularNivel(notas, 24, competencia.competencia.id);
        competencia.logro4 = this.calcularNivel(notas, 34, competencia.competencia.id);
        competencia.logroanual = this.calcularLogro(competencia.logro1, competencia.logro2, competencia.logro3, competencia.logro4);
      });
    });
  }

  retornaLogroVigesimal(notas: any[]) {
    this.datos.forEach(dato => {
      let competencias: any[] = dato.competencias;
      competencias.forEach(competencia => {
        competencia.logro1 = this.calcularPromedio(notas, 4, competencia.competencia.id);
        competencia.logro2 = this.calcularPromedio(notas, 14, competencia.competencia.id);
        competencia.logro3 = this.calcularPromedio(notas, 24, competencia.competencia.id);
        competencia.logro4 = this.calcularPromedio(notas, 34, competencia.competencia.id);
        competencia.logroanual = this.calcularPromedioAnual(competencia.logro1, competencia.logro2, competencia.logro3, competencia.logro4);;
      });
    });
  }

  calcularPromedioAnual(logro1: any, logro2: any, logro3: any, logro4: any) {
    let calificacion = "-";
    if (logro1 != "-" && logro2 != "-" && logro3 != "-" && logro4 != "-") {
      let suma = Number(logro1) + Number(logro2) + Number(logro3) + Number(logro4);
      let promedio = Math.round(suma / 4);
      calificacion = String(promedio);
    }
    return calificacion;
  }

  calcularLogro(logro1: any, logro2: any, logro3: any, logro4: any) {
    let calificacion = "-";
    if (logro1 != "-" && logro2 != "-" && logro3 != "-" && logro4 != "-") {
      let valor1 = this.obtenerMaximo(logro1);
      let valor2 = this.obtenerMaximo(logro2);
      let valor3 = this.obtenerMaximo(logro3);
      let valor4 = this.obtenerMaximo(logro4);
      let suma = valor1 + valor2 + valor3 + valor4;
      let promedio = Math.round(suma / 4);
      calificacion = this.obtenerCalificacion(promedio);
    }
    return calificacion;
  }
  obtenerCalificacion(promedio: any) {
    let calificacion = "-";
    this.rangos.forEach(rango => {
      if (rango.inicio <= promedio && rango.fin >= promedio) {
        calificacion = rango.letra;
      }
    });
    return calificacion;
  }
  obtenerMaximo(logro: any) {
    let maximo = 0;
    this.rangos.forEach(rango => {
      if (rango.letra == logro) {
        maximo = rango.fin;
      }
    });
    return maximo;
  }
  calcularPromedio(notas: any[], cicloId: number, competenciaId: number) {
    let suma = 0;
    let promedio = 0;
    let retorno = "-";
    let totalNotas = 0;
    let contador = 0;
    notas.forEach(nota => {
      if (nota.ciclo?.id == cicloId && nota.competencia?.id == competenciaId) {
        suma = suma + nota.valor;
        contador = contador + 1;
      }
    });
    totalNotas = contador;
    if (totalNotas > 0) {
      promedio = Math.round(suma / totalNotas);
      retorno = String(promedio);
    }
    return retorno;
  }
  calcularNivel(notas: any[], cicloId: number, competenciaId: number) {
    let vector: any[] = [];
    let nivelFinal = "-";
    this.rangos.forEach(rango => {
      let objeto = {
        rango: rango,
        total: 0,
        porcentaje: 0,
        nivel: 0
      };
      vector.push(objeto);
    });
    notas.forEach(nota => {
      if (nota.ciclo?.id == cicloId && nota.competencia?.id == competenciaId) {
        vector.forEach(item => {
          if (item.rango.letra == nota.valor) {
            item.total = item.total + 1;
          }
        });
      }
    });
    // Calculamos el total de notas
    let totalNotas = 0;
    vector.forEach(item => {
      totalNotas = totalNotas + item.total;
    });
    if (totalNotas > 0) {
      // Calculamos porcentaje y nivel
      vector.forEach(item => {
        item.porcentaje = item.total / totalNotas;
        item.nivel = item.porcentaje * item.rango.fin;
      });
      // Calculamos la sumanivel
      let sumaNivel = 0;
      vector.forEach(item => {
        sumaNivel = sumaNivel + item.nivel;
      });
      // retornamos la califacion
      nivelFinal = this.retornaCalificacion(sumaNivel);
    }
    return nivelFinal;
  }
  retornaCalificacion(nivel: number) {
    let calificacion = "";
    this.rangos.forEach(rango => {
      if (rango.inicio <= nivel && rango.fin >= nivel) {
        calificacion = rango.letra;
      }
    });
    return calificacion;
  }
  retornaCompetencias(area: any) {
    let lista: any[] = [];
    let competencias: any[] = area.competencia;
    competencias.forEach(competencia => {
      let objeto = {
        competencia: competencia,
        logro1: "-",
        logro2: "-",
        logro3: "-",
        logro4: "-",
        logroanual: "-",
      };
      lista.push(objeto);
    });
    return lista;
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
      let nombreArchivo = 'INFORME: ' + moment().format('DD/MM/yyyy') + '.pdf';
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrAlumnos = (this.repForm.get('alumnoId')?.value).split(',');
      this.alumnonombre = arrAlumnos[1] + ' ' + arrAlumnos[2] + ' ' + arrAlumnos[3];
      if (this.tipovalor == 1) {
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
              text: 'INFORME DE PROGRESO DE APRENDIZAJE DEL ESTUDIANTE',
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
                { text: 'ALUMNO: ', bold: true, }, this.alumnonombre
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },
            {
              text: [
                { text: 'FECHA : ', bold: true, }, moment().format('DD/MM/yyyy')
              ],
              fontSize: 12,
              color: '#0000',
              margin: [0, 1, 0, 5],
            },

            {
              margin: [0, 1, 0, 5],
              table: {
                headerRows: 1,
                widths: ['auto', 100, 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'AREA', bold: true, alignment: 'center' },
                    { text: '', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.area.nombre,
                      [
                        {
                          margin: [0, 1, 0, 1],
                          table: {
                            widths: [150, 20, 20, 20, 20, 40, 40],
                            body: [
                              [
                                { text: 'Competencia', bold: true, fontSize: 10 },
                                { text: 'I', bold: true, fontSize: 10 },
                                { text: 'II', bold: true, fontSize: 10 },
                                { text: 'III', bold: true, fontSize: 10 },
                                { text: 'IV', bold: true, fontSize: 10 },
                                { text: 'LOGRO ANUAL', bold: true, fontSize: 10 },
                                { text: 'EX. SUSTITUTORIO', bold: true, fontSize: 10 }
                              ],
                              ...p.competencias.map((nt: any) => (
                                [
                                  { text: nt.competencia.descripcion, fontSize: 10 },
                                  nt.logro1,
                                  nt.logro2,
                                  nt.logro3,
                                  nt.logro4,
                                  { text: nt.logroanual, bold: true, alignment: 'center' },
                                  { text: "-",alignment: 'center' }
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

            {
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'VALOR', bold: true, alignment: 'center' },
                    { text: 'I', bold: true, alignment: 'center' },
                    { text: 'II', bold: true, alignment: 'center' },
                    { text: 'III', bold: true, alignment: 'center' },
                    { text: 'IV', bold: true, alignment: 'center' },
                  ],
                  ...this.resumenes.map(p => (
                    [
                      p.rango.letra,
                      p.total1,
                      p.total2,
                      p.total3,
                      p.total4,
                    ])),
                ]
              }
            },

            {
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: [120, 150, 80, 150],
                //heights: [30, 30, 30, 30],
                body: [
                  [
                    { text: 'APRECIACIÓN DEL TUTOR', bold: true, alignment: 'center', fontSize: 10 },
                    { text: 'DESCRIPCION', bold: true, alignment: 'center', fontSize: 10 },
                    { text: 'RESPOSABILIDAD DEL PADRE', bold: true, alignment: 'center', fontSize: 10 },
                    { text: 'FIRMA DEL TUTOR', bold: true, alignment: 'center', fontSize: 10 },
                  ],
                  ...this.apreciaciondetalles.map(p => (
                    [
                      { text: 'APRECIACIÓN DEL TUTOR PARA EL '+(p.nombre).toUpperCase(), fontSize: 10},
                      { text: p.descripcion, fontSize: 10 },
                      { text: p.responsabilidad, fontSize: 10, alignment: "center" },
                      { text: '' },
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
      } else {
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
              text: 'INFORME DE PROGRESO DE APRENDIZAJE DEL ESTUDIANTE',
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
                { text: 'ALUMNO: ', bold: true, }, this.alumnonombre
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },
            {
              text: [
                { text: 'FECHA : ', bold: true, }, moment().format('DD/MM/yyyy')
              ],
              fontSize: 12,
              color: '#0000',
              margin: [0, 1, 0, 5],
            },

            {
              margin: [0, 1, 0, 5],
              table: {
                headerRows: 1,
                widths: ['auto', 100, 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'AREA', bold: true, alignment: 'center' },
                    { text: '', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.area.nombre,
                      [
                        {
                          margin: [0, 1, 0, 1],
                          table: {
                            widths: [150, 20, 20, 20, 20, 40, 40],
                            body: [
                              [
                                { text: 'Competencia', bold: true, fontSize: 10 },
                                { text: 'I', bold: true, fontSize: 10 },
                                { text: 'II', bold: true, fontSize: 10 },
                                { text: 'III', bold: true, fontSize: 10 },
                                { text: 'IV', bold: true, fontSize: 10 },
                                { text: 'LOGRO ANUAL', bold: true, fontSize: 10 },
                                { text: 'EX. SUSTITUTORIO', bold: true, fontSize: 10 }
                              ],
                              ...p.competencias.map((nt: any) => (
                                [
                                  { text: nt.competencia.descripcion, fontSize: 10 },
                                  nt.logro1,
                                  nt.logro2,
                                  nt.logro3,
                                  nt.logro4,
                                  { text: nt.logroanual, bold: true, alignment: 'center' },
                                  { text:"-", alignment: 'center' }
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
            {
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'VALOR', bold: true, alignment: 'center' },
                    { text: 'I', bold: true, alignment: 'center' },
                    { text: 'II', bold: true, alignment: 'center' },
                    { text: 'III', bold: true, alignment: 'center' },
                    { text: 'IV', bold: true, alignment: 'center' },
                  ],
                  ...this.resumenes.map(p => (
                    [
                      p.rango.inicio + ' - ' + p.rango.fin,
                      p.total1,
                      p.total2,
                      p.total3,
                      p.total4,
                    ])),
                ]
              }
            },

            {
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: [120, 150, 80, 150],
                body: [
                  [
                    { text: 'APRECIACIÓN DEL TUTOR', bold: true, alignment: 'center', fontSize: 10 },
                    { text: 'DESCRIPCION', bold: true, alignment: 'center', fontSize: 10 },
                    { text: 'RESPOSABILIDAD DEL PADRE', bold: true, alignment: 'center', fontSize: 10 },
                    { text: 'FIRMA DEL TUTOR', bold: true, alignment: 'center', fontSize: 10 },
                  ],
                  ...this.apreciaciondetalles.map(p => (
                    [
                      { text: 'APRECIACIÓN DEL TUTOR PARA EL '+(p.nombre).toUpperCase(), fontSize: 10},
                      { text: p.descripcion, fontSize: 10 },
                      { text: p.responsabilidad, fontSize: 10, alignment: "center" },
                      { text: '' },
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
