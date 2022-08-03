import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as  moment from 'moment';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { AulaService } from 'src/app/services/aula.service';
import { SubareaService } from 'src/app/services/subarea.service';
import { Aula } from 'src/app/models/aula.model';
import { Subarea } from 'src/app/models/subarea.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Docente } from 'src/app/models/docente.model';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { RangoService } from 'src/app/services/rango.service';
import { Rango } from 'src/app/models/rango.model';

@Component({
  selector: 'app-reporte-nota',
  templateUrl: './reporte-nota.component.html',
  styleUrls: ['./reporte-nota.component.css']
})
export class ReporteNotaComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Alumnos';
  public icono2: string = 'bi bi-people-fill';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public repForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public ciclos: Ciclo[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public evaluaciones: Evaluacion[] = [];
  @ViewChild('htmlData') htmlData!: ElementRef;
  public institucion!: Institucion;
  public aulas: Aula[] = [];
  public subareas: Subarea[] = [];
  public rangos: Rango[] = [];
  public aulasAux: Aula[] = [];
  public subareasAux: Subarea[] = [];
  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public ciclonombre: string = "";
  public docentenombre: string = "";
  public aprobados: number = 0;
  public desaprobados: number = 0;
  public total: number = 0;
  public docente!: Docente;
  public apoderado!: Apoderado;
  public cargando: boolean = false;
  public bandBoton: number = 0;
  public mensajeboton: string = "Convertir a Letras";

  constructor(private menuService: MenuService, private fb: FormBuilder,
    private cicloService: CicloService, private periodoService: PeriodoService,
    private matriculaService: MatriculaService,
    private evaluacionService: EvaluacionService, private institucionService: InstitucionService,
    private aulaService: AulaService, private subareaService: SubareaService,
    private usuarioService: UsuarioService, private programacionService: ProgramacionService,
    private rangoService: RangoService) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });
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
    this.evaluacionService.todo().subscribe(({ ok, evaluaciones }) => {
      if (ok) {
        this.evaluaciones = evaluaciones;
      }
    });

    this.rangoService.todo().subscribe(({ ok, rangos }) => {
      if (ok) {
        this.rangos = rangos;
      }
    });

    if (this.usuarioService.usuario.role.nombre === "DOCENTE") {

      this.usuarioService.docentePorPersona().subscribe({
        next: ({ ok, docente }) => {
          if (ok) {
            this.docente = docente;
            this.programacionService.programacionesPorDocente(Number(this.docente.id))
              .subscribe({
                next: ({ ok, programaciones }) => {
                  if (ok) {

                    programaciones.forEach(programacion => {
                      this.aulasAux.push(programacion.aula!);
                      this.subareasAux.push(programacion.subarea!);
                    });

                    var lookupObject: any = {};
                    var lookupObject2: any = {};
                    for (var i in this.aulasAux) {
                      lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
                    }
                    for (i in lookupObject) {
                      this.aulas.push(lookupObject[i]);
                    }

                    for (var i in this.subareasAux) {
                      lookupObject2[this.subareasAux[i].id!] = this.subareasAux[i];
                    }
                    for (i in lookupObject2) {
                      this.subareas.push(lookupObject2[i]);
                    }
                  }
                }
              })
          }
        }
      });
    }

    if (this.usuarioService.usuario.role.nombre === "ADMINISTRADOR") {
      this.aulaService.todo().subscribe({
        next: ({ ok, aulas }) => {
          if (ok) {
            this.aulas = aulas;
          }
        }
      });
      this.subareaService.todo().subscribe({
        next: ({ ok, subareas }) => {
          if (ok) {
            this.subareas = subareas;
          }
        }
      });
    }
    if (this.usuarioService.usuario.role.nombre === "APODERADO") {

      this.usuarioService.apoderadoPorPersona().subscribe(({ ok, apoderado }) => {
        if (ok) {
          this.apoderado = apoderado;

          this.matriculaService.matriculasApoderado(Number(this.apoderado.id))
            .subscribe({
              next: ({ ok, matriculas }) => {
                if (ok) {
                  matriculas.forEach(matricula => {
                    this.aulasAux.push(matricula.programacion?.aula!);
                  });
                  var lookupObject: any = {};
                  for (var i in this.aulasAux) {
                    lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
                  }
                  for (i in lookupObject) {
                    this.aulas.push(lookupObject[i]);
                  }
                  this.subareaService.todo().subscribe({
                    next: ({ ok, subareas }) => {
                      if (ok) {
                        this.subareas = subareas;
                      }
                    }
                  });
                }
              }
            });
        }
      });
    }
    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.repForm = this.fb.group({
      periodoId: ['', Validators.required],
      cicloId: ['', Validators.required],
      aulaId: ['', Validators.required],
      subareaId: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.repForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  retornaPromedio(objetos: any[]) {
    let p = 0;
    let tipo = "";
    let abreviatura = "";
    let total = 0;
    let promedioLetra = "";
    let promedioNumero = 0;
    let promedios: any[] = [];
    this.evaluaciones.forEach(evaluacion => {
      p = 0;
      tipo = evaluacion.nombre;
      abreviatura = evaluacion.abreviatura;
      total = 0;
      promedioLetra = "";
      promedioNumero = 0;
      objetos.forEach(objeto => {
        if (objeto.evaluacion.id == evaluacion.id) {
          p = p + objeto.valor;
          total = total + 1;
        }
      });
      let pt = {};

      promedioNumero = Math.round(p / total);

      /*
      if (promedioNumero >= 0 && promedioNumero <= 10) {
        promedioLetra = "C";
      }
      if (promedioNumero >= 11 && promedioNumero <= 14) {
        promedioLetra = "B";
      }
      if (promedioNumero >= 15 && promedioNumero <= 17) {
        promedioLetra = "A";
      }
      if (promedioNumero >= 18 && promedioNumero <= 20) {
        promedioLetra = "AD";
      }
      */
      if (total > 0) {
        pt = {
          promedio: promedioNumero,
          tipo: tipo,
          letra: this.obtenerLetra(promedioNumero).letra,
          abreviatura: abreviatura
        }
      } else {
        pt = {
          promedio: 0,
          tipo: tipo,
          letra: "C",
          abreviatura: abreviatura
        }
      }
      promedios.push(pt);
    });
    return promedios;
  }

  public obtenerLetra(valor: any) {
    let retorno = {
      letra: "NL",
      situacion: "NS",
      alias:""
    };
    this.rangos.forEach(rango => {
      if (valor >= rango.inicio && valor <= rango.fin) {
        retorno = {
          letra: rango.letra,
          situacion: rango.situacion,
          alias: rango.alias
        };
      }
    });
    return retorno;
  }

  promedioTotal(vector: any[]) {
    let prom = 0;
    let proTot = 0;
    vector.forEach(obj => {
      prom = prom + obj.promedio;
    });
    proTot = Math.round(prom / vector.length);
    return proTot;
  }

  coversionNotas() {

    if (this.bandBoton == 0) {
      this.bandBoton = 1;
      this.mensajeboton = "Convertir a Numeros";
    } else {
      this.bandBoton = 0;
      this.mensajeboton = "Convertir a Letras";
    }
  }


  buscarNotas() {
    this.formSubmitted = true;

    if (this.repForm.valid) {
      this.datos = [];
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.repForm.get('subareaId')?.value).split(',');
      let arrciclos = (this.repForm.get('cicloId')?.value).split(',');
      let aprobo = 0;
      let desaprobo = 0;
      this.cargando = true;

      if (this.usuarioService.usuario.role.nombre === "APODERADO") {
        this.matriculaService.matriculasPeriodoAulaSubareaCicloApoderado(
          Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]), Number(arrciclos[0]),
          Number(this.apoderado.id))
          .subscribe({
            next: ({ ok, matriculas }) => {
              if (ok) {
                let i = 0;
                let promT = 0;
              
                matriculas.forEach(matricula => {
                  let vectorNotas = matricula.nota;
                  i = i + 1;
                  /**CODIGO AGREGADO */
                  promT = this.promedioTotal(this.retornaPromedio(vectorNotas));

                  /**CODIGO AGREGADO */
                  let retornoA = this.obtenerLetra(promT);
                  let detalle = {
                    indice: i,
                    matriculaObj: matricula,
                    promedios: this.retornaPromedio(vectorNotas),
                    promedioTotal: promT,
                    promedioTotalLetra: retornoA.letra,
                    situacionAlumno: retornoA.situacion,
                    alias: retornoA.alias
                  }
                  if (detalle.promedioTotal >= 11) {
                    aprobo = aprobo + 1;
                  } else {
                    desaprobo = desaprobo + 1;
                  }
                  this.docentenombre = detalle.matriculaObj.programacion?.docente?.persona?.nombres! + ' ' +
                    detalle.matriculaObj.programacion?.docente?.persona?.apellidopaterno + ' ' +
                    detalle.matriculaObj.programacion?.docente?.persona?.apellidomaterno;
                  this.datos.push(detalle);
                });
                this.aprobados = aprobo;
                this.desaprobados = desaprobo;
                this.total = this.datos.length;
                this.cargando = false;
              }
            }
          });
      } else {
        this.matriculaService.matriculasPeriodoAulaSubareaCiclo(
          Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]), Number(arrciclos[0]))
          .subscribe({
            next: ({ ok, matriculas }) => {
              if (ok) {
                let i = 0;
                let promT = 0;
               
                matriculas.forEach(matricula => {
                  let vectorNotas = matricula.nota;
                  i = i + 1;
                  /**CODIGO AGREGADO */
                  promT = this.promedioTotal(this.retornaPromedio(vectorNotas));

                  /**CODIGO AGREGADO */
                  let retornoA = this.obtenerLetra(promT);
                  let detalle = {
                    indice: i,
                    matriculaObj: matricula,
                    promedios: this.retornaPromedio(vectorNotas),
                    promedioTotal: promT,
                    promedioTotalLetra: retornoA.letra,
                    situacionAlumno: retornoA.situacion,
                    alias: retornoA.alias
                  }
                  if (detalle.promedioTotal >= 11) {
                    aprobo = aprobo + 1;
                  } else {
                    desaprobo = desaprobo + 1;
                  }
                  this.docentenombre = detalle.matriculaObj.programacion?.docente?.persona?.nombres! + ' ' +
                    detalle.matriculaObj.programacion?.docente?.persona?.apellidopaterno + ' ' +
                    detalle.matriculaObj.programacion?.docente?.persona?.apellidomaterno;

                  this.datos.push(detalle);
                });
                this.aprobados = aprobo;
                this.desaprobados = desaprobo;
                this.total = this.datos.length;
                this.cargando = false;
              }
            }
          });
      }

      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.subareanombre = arrSubareas[1];
      this.ciclonombre = arrciclos[1];

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
      let arrSubareas = (this.repForm.get('subareaId')?.value).split(',');
      let arrciclos = (this.repForm.get('cicloId')?.value).split(',');

      if (this.bandBoton == 0) {
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
                { text: 'SUBAREA: ', bold: true, }, arrSubareas[1]
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },

            {
              text: [
                { text: 'DOCENTE: ', bold: true, }, this.docentenombre
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
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'APELLIDOS Y NOMBRES', bold: true, alignment: 'center' },
                    { text: 'PROM. EVAL.', bold: true, alignment: 'center' },
                    { text: 'PROM. TOTAL', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.matriculaObj.alumno.persona.apellidopaterno + ' '
                      + p.matriculaObj.alumno.persona.apellidomaterno + ' '
                      + p.matriculaObj.alumno.persona.nombres,
                      p.promedios.map((pr: any) => (
                        [
                          { text: pr.abreviatura + ' : ' + pr.promedio, alignment: "center" }
                        ]
                      )),
                      { text: p.promedioTotal, alignment: 'center' },
                      { text: p.situacionAlumno, alignment: 'center' }
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
              table: {
                widths: [100, 'auto'],
                body: [
                  [
                    'APROBADOS: ', this.aprobados,
                  ],
                  [
                    'DESAPROBADOS: ', this.desaprobados
                  ],
                  [
                    'TOTAL: ', this.total
                  ]
                ],
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
                { text: 'SUBAREA: ', bold: true, }, arrSubareas[1]
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },

            {
              text: [
                { text: 'DOCENTE: ', bold: true, }, this.docentenombre
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
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'APELLIDOS Y NOMBRES', bold: true, alignment: 'center' },
                    { text: 'PROM. EVAL.', bold: true, alignment: 'center' },
                    { text: 'PROM. TOTAL', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.matriculaObj.alumno.persona.apellidopaterno + ' '
                      + p.matriculaObj.alumno.persona.apellidomaterno + ' '
                      + p.matriculaObj.alumno.persona.nombres,
                      p.promedios.map((pr: any) => (
                        [
                          { text: pr.abreviatura + ' : ' + pr.letra, alignment: "center" }
                        ]
                      )),
                      { text: p.promedioTotalLetra, alignment: 'center' },
                      { text: p.situacionAlumno, alignment: 'center' }
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
              table: {
                widths: [100, 'auto'],
                body: [
                  [
                    'APROBADOS: ', this.aprobados,
                  ],
                  [
                    'DESAPROBADOS: ', this.desaprobados
                  ],
                  [
                    'TOTAL: ', this.total
                  ]
                ],
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
