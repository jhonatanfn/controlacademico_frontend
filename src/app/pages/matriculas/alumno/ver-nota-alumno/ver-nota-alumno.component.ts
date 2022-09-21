import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Rango } from 'src/app/models/rango.model';
import { RangoService } from 'src/app/services/rango.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Nota } from 'src/app/models/nota.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { NotaService } from 'src/app/services/nota.service';

@Component({
  selector: 'app-ver-nota-alumno',
  templateUrl: './ver-nota-alumno.component.html',
  styleUrls: ['./ver-nota-alumno.component.css']
})
export class VerNotaAlumnoComponent implements OnInit {

  public titulo1: string = 'Buscar Notas';
  public icono1: string = 'bi bi-search';
  public titulo2: string = 'Notas';
  public icono2: string = 'bi bi-stickies';
  public titulo3: string = 'Datos Matricula';
  public icono3: string = 'bi bi-card-checklist';
  public titulo4: string = 'Resumen';
  public icono4: string = 'bi bi-paperclip';
  public notaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public ciclos: Ciclo[] = [];
  public evaluaciones: Evaluacion[] = [];
  public notas: Nota[] = [];
  public rangos: Rango[] = [];
  public notasAux: any[] = [];
  public cargando: boolean = false;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public areanombre: string = "";
  public ciclonombre: string = "";
  public docentenombre: string = "";
  public tipovalor: number = 0;
  public evaluacionnombre: string = "";
  public promediototal: number = 0;
  public promediototalletra: string = "";
  public totalevaluaciones: number = 0;
  public alumnonombre: string = "";
  public institucion!: Institucion;
  public bandBoton: number = 0;
  public mensajeboton: string = "Convertir a Letras";
  public vigesimal: any[] = [];
  public literal: any[] = [];


  constructor(private fb: FormBuilder, private cicloService: CicloService,
    private evaluacionService: EvaluacionService, private notaService: NotaService,
    private route: ActivatedRoute, private matriculadetalleService: MatriculadetalleService,
    private institucionService: InstitucionService, private rangoService: RangoService) {

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

    this.matriculadetalleService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, matriculadetalle }) => {
          if (ok) {
            this.periodonombre = matriculadetalle.programacion?.periodo?.nombre!;
            this.aulanombre = matriculadetalle.programacion?.aula?.nombre!;
            this.areanombre = matriculadetalle.programacion?.area?.nombre!;
            this.docentenombre = matriculadetalle.programacion?.docente?.persona?.nombres! + ' ' +
              matriculadetalle.programacion?.docente?.persona?.apellidopaterno! + ' ' +
              matriculadetalle.programacion?.docente?.persona?.apellidomaterno!;
            this.alumnonombre = matriculadetalle.matricula?.alumno?.persona?.nombres + ' ' +
              matriculadetalle.matricula?.alumno?.persona?.apellidopaterno + ' ' +
              matriculadetalle.matricula?.alumno?.persona?.apellidomaterno;
            this.tipovalor = Number(matriculadetalle.programacion?.aula?.tipovalor);
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
    this.literal = [];
    this.vigesimal = [];
    if (this.notaForm.valid) {
      this.cargando = true;
      let arrciclos = (this.notaForm.get('cicloId')?.value).split(',');
      let arrevaluaciones = (this.notaForm.get('evaluacionId')?.value).split(',');
      this.notaService.notasMatriculaCicloEvaluacion(Number(this.route.snapshot.paramMap.get('id')),
        arrciclos[0],
        arrevaluaciones[0]).subscribe({
          next: ({ ok, notas }) => {
            if (ok) {
              this.notas = notas;
              let totalNotas = notas.length;
              if (this.tipovalor == 1) {
                // literal
                this.rangos.forEach(rango => {
                  let objeto = {
                    rango: rango,
                    total: 0,
                    porcentaje: 0,
                  }
                  this.literal.push(objeto);
                });
                this.notas.forEach(nota => {
                  this.literal.forEach(dato => {
                    if (dato.rango.letra == nota.valor) {
                      dato.total = dato.total + 1;
                      dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                    }
                  });
                });
              }

              if (this.tipovalor == 2) {
                // vigesimal
                this.rangos.forEach(rango => {
                  let objeto = {
                    rango: rango,
                    total: 0,
                    porcentaje: 0
                  }
                  this.vigesimal.push(objeto);
                });
                this.notas.forEach(nota => {
                  this.vigesimal.forEach(dato => {
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
  }

  retornaLetra(valor: any) {
    let item = {
      letra: "",
      situacion: "",
      alias: ""
    };
    let objA = this.obtenerLetra(valor);
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

    let objB = this.obtenerLetra(this.promediototal);
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

      if (this.tipovalor === 1) {
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
                { text: 'DOCENTE: ', bold: true, }, this.docentenombre
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
                    { text: 'AREA', bold: true, alignment: 'center' },
                    { text: 'COMPETENCIA', bold: true, alignment: 'center' },
                    { text: 'CICLO', bold: true, alignment: 'center' },
                    { text: 'EVALUACION', bold: true, alignment: 'center' },
                    { text: 'NOTA', bold: true, alignment: 'center' },

                  ],
                  ...this.notas.map(p => (
                    [
                      this.notas.indexOf(p) + 1,
                      p.competencia?.area?.nombre,
                      p.competencia?.descripcion,
                      p.ciclo?.nombre,
                      p.evaluacion?.nombre,
                      p.valor
                    ])),
                ]
              }
            },
            
            {
              margin: [0, 1, 0, 5],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'ESCALA', bold: true, alignment: 'center' },
                    { text: 'TOTAL', bold: true, alignment: 'center' },
                    { text: 'PORCENTAJE', bold: true, alignment: 'center' },
                    { text: 'SITUACION', bold: true, alignment: 'center' },
                  ],
                  ...this.literal.map(p => (
                    [
                      this.literal.indexOf(p) + 1,
                      p.rango.letra,
                      p.total,
                      p.porcentaje+' % ',
                      p.rango.situacion
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
      }else{


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
                { text: 'DOCENTE: ', bold: true, }, this.docentenombre
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
                    { text: 'AREA', bold: true, alignment: 'center' },
                    { text: 'COMPETENCIA', bold: true, alignment: 'center' },
                    { text: 'CICLO', bold: true, alignment: 'center' },
                    { text: 'EVALUACION', bold: true, alignment: 'center' },
                    { text: 'NOTA', bold: true, alignment: 'center' },

                  ],
                  ...this.notas.map(p => (
                    [
                      this.notas.indexOf(p) + 1,
                      p.competencia?.area?.nombre,
                      p.competencia?.descripcion,
                      p.ciclo?.nombre,
                      p.evaluacion?.nombre,
                      p.valor
                    ])),
                ]
              }
            },
            
            {
              margin: [0, 1, 0, 5],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'RANGO', bold: true, alignment: 'center' },
                    { text: 'TOTAL', bold: true, alignment: 'center' },
                    { text: 'PORCENTAJE', bold: true, alignment: 'center' },
                    { text: 'SITUACION', bold: true, alignment: 'center' },
                  ],
                  ...this.vigesimal.map(p => (
                    [
                      this.vigesimal.indexOf(p) + 1,
                      p.rango.inicio+' - '+p.rango.fin,
                      p.total,
                      p.porcentaje+' % ',
                      p.rango.situacion
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
