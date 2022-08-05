import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Nota } from 'src/app/models/nota.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { NotaService } from 'src/app/services/nota.service';
import Swal from 'sweetalert2';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import { Rango } from 'src/app/models/rango.model';
import { RangoService } from 'src/app/services/rango.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ver-nota-alumno',
  templateUrl: './ver-nota-alumno.component.html',
  styleUrls: ['./ver-nota-alumno.component.css']
})
export class VerNotaAlumnoComponent implements OnInit {

  public titulo1: string = 'Buscar Notas';
  public icono1: string = 'bi bi-search';
  public titulo2: string = 'Tabla Notas';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public notaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public ciclos: Ciclo[] = [];
  public evaluaciones: Evaluacion[] = [];
  public notas: Nota[] = [];
  public rangos:Rango[]=[];
  public notasAux: any[] = [];
  public cargando: boolean = false;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public ciclonombre: string = "";
  public docentenombre: string = "";
  public evaluacionnombre: string = "";
  public promediototal: number = 0;
  public promediototalletra: string = "";
  public totalevaluaciones: number = 0;
  public alumnonombre: string = "";
  public institucion!: Institucion;
  public bandBoton: number = 0;
  public mensajeboton: string = "Convertir a Letras";

  constructor(private fb: FormBuilder, private cicloService: CicloService,
    private evaluacionService: EvaluacionService, private notaService: NotaService,
    private route: ActivatedRoute, private matriculaService: MatriculaService,
    private institucionService: InstitucionService, private rangoService:RangoService) {

    this.cicloService.listar().subscribe(({ ok, ciclos }) => {
      if (ok) {
        this.ciclos = ciclos;
      }
    });
    this.evaluacionService.listar().subscribe(({ ok, evaluaciones }) => {
      if (ok) {
        this.evaluaciones = evaluaciones;
      }
    });

    this.rangoService.todo().subscribe(({ ok, rangos }) => {
      if (ok) {
        this.rangos = rangos;
      }
    });

    this.matriculaService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, matricula }) => {
          if (ok) {
            this.periodonombre = matricula.programacion?.periodo?.nombre!;
            this.aulanombre = matricula.programacion?.aula?.nombre!;
            this.subareanombre = matricula.programacion?.subarea?.nombre!;
            this.docentenombre = matricula.programacion?.docente?.persona?.nombres! + ' ' +
              matricula.programacion?.docente?.persona?.apellidopaterno! + ' ' +
              matricula.programacion?.docente?.persona?.apellidomaterno!;
            this.alumnonombre = matricula.alumno?.persona?.nombres + ' ' +
              matricula.alumno?.persona?.apellidopaterno + ' ' +
              matricula.alumno?.persona?.apellidomaterno;
          }
        },
        error: (error) => {
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
    this.notaForm = this.fb.group({
      cicloId: ['', Validators.required],
      evaluacionId: ['', Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.notaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
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

  public obtenerLetra(valor: any) {
    let retorno = {
      letra: "NL",
      situacion: "NS",
      alias: ""
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

  buscarNotas() {
    this.formSubmitted = true;
    if (this.notaForm.valid) {
      this.cargando = true;
      let arrciclos = (this.notaForm.get('cicloId')?.value).split(',');
      let arrevaluaciones = (this.notaForm.get('evaluacionId')?.value).split(',');
      this.notasAux = [];
      this.notas = [];
      this.notaService.notasMatriculaCicloEvaluacion(Number(this.route.snapshot.paramMap.get('id')),
        arrciclos[0],
        arrevaluaciones[0]).subscribe(({ ok, notas }) => {
          if (ok) {
            this.notas = notas;
            let objeto = {
              fecha: "",
              ciclo: "",
              evaluacion: "",
              valor: 0,
              valorletra: "",
              situacion: "",
              alias:""
            }
            this.notas.forEach(nota => {
              let oobj=this.retornaLetra(nota.valor);
              objeto = {
                fecha: nota.fecha,
                ciclo: arrciclos[1],
                evaluacion: arrevaluaciones[1],
                valor: nota.valor,
                valorletra: oobj.letra,
                situacion: oobj.situacion,
                alias: oobj.alias
              }
              this.notasAux.push(objeto);
            });

            this.ciclonombre = arrciclos[1];
            this.evaluacionnombre = arrevaluaciones[1];
            this.totalevaluaciones = notas.length;
            this.calcularPromedio();
            this.cargando = false;
          }
        });
    }
  }

  retornaLetra(valor: any) {
    let item = {
      letra: "",
      situacion: "",
      alias:""
    };
    let objA= this.obtenerLetra(valor);
    item = {
      letra: objA.letra,
      situacion: objA.situacion,
      alias: objA.alias
    };

    return item;
  }

  calcularPromedio() {
    let suma = 0;
    let promedio = 0;
    this.notas.forEach(nota => {
      suma = suma + nota.valor;
    });
    promedio = Math.round(suma / this.notas.length);
    this.promediototal = promedio;

    let objB= this.obtenerLetra(this.promediototal);
    this.promediototalletra = objB.letra;

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

    if (this.notaForm.valid) {
      let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
      let nombreArchivo = 'REPORTE: ' + moment().format('DD/MM/yyyy') + '.pdf';

      if (this.bandBoton === 0) {
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
                { text: 'PERIODO: ', bold: true }, this.periodonombre
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
                { text: 'SUBAREA: ', bold: true, }, this.subareanombre
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
                { text: 'CICLO: ', bold: true, }, this.ciclonombre
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
                { text: 'EVALUACIÓN: ', bold: true, }, this.evaluacionnombre
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
              margin: [0, 1, 0, 1],
            },

            {
              //layout: 'lightHorizontalLines',
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'FECHA', bold: true, alignment: 'center' },
                    { text: 'CICLO', bold: true, alignment: 'center' },
                    { text: 'EVALUACIÓN', bold: true, alignment: 'center' },
                    { text: 'NOTA', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },

                  ],
                  ...this.notasAux.map(p => (
                    [
                      this.notasAux.indexOf(p) + 1,
                      p.fecha,
                      p.ciclo,
                      p.evaluacion,
                      p.valor,
                      { text: p.situacion, alignment: 'center' }
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
                widths: ['auto', 'auto'],
                body: [
                  [
                    'PROMEDIO: ', this.promediototal
                  ],
                  [
                    'TOTAL EVALUACIONES: ', this.totalevaluaciones
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
                { text: 'PERIODO: ', bold: true }, this.periodonombre
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
                { text: 'SUBAREA: ', bold: true, }, this.subareanombre
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
                { text: 'CICLO: ', bold: true, }, this.ciclonombre
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
                { text: 'EVALUACIÓN: ', bold: true, }, this.evaluacionnombre
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
              margin: [0, 1, 0, 1],
            },
            {
              //layout: 'lightHorizontalLines',
              margin: [0, 10, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'FECHA', bold: true, alignment: 'center' },
                    { text: 'CICLO', bold: true, alignment: 'center' },
                    { text: 'EVALUACIÓN', bold: true, alignment: 'center' },
                    { text: 'NOTA', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },

                  ],
                  ...this.notasAux.map(p => (
                    [
                      this.notasAux.indexOf(p) + 1,
                      p.fecha,
                      p.ciclo,
                      p.evaluacion,
                      p.valorletra,
                      { text: p.situacion, alignment: 'center' }
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
                widths: ['auto', 'auto'],
                body: [
                  [
                    'PROMEDIO: ', this.promediototalletra
                  ],
                  [
                    'TOTAL EVALUACIONES: ', this.totalevaluaciones
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
