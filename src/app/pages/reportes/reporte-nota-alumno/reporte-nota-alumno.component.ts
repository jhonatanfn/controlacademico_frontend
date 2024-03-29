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
import { Matricula } from 'src/app/models/matricula.model';
import { Docente } from 'src/app/models/docente.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Alumno } from 'src/app/models/alumno.model';
import { RangoService } from 'src/app/services/rango.service';
import { Rango } from 'src/app/models/rango.model';

@Component({
  selector: 'app-reporte-nota-alumno',
  templateUrl: './reporte-nota-alumno.component.html',
  styleUrls: ['./reporte-nota-alumno.component.css']
})
export class ReporteNotaAlumnoComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Lista de Notas';
  public icono2: string = 'bi bi-calendar-check';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public titulo4: string = 'Promedios por Evaluación';
  public icono4: string = 'bi bi-calculator-fill';
  public repForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public ciclos: Ciclo[] = [];
  public datos: any[] = [];
  public promedios: any[] = [];
  public formSubmitted: boolean = false;
  public evaluaciones: Evaluacion[] = [];
  @ViewChild('htmlData') htmlData!: ElementRef;
  public institucion!: Institucion;
  public aulas: Aula[] = [];
  public subareas: Subarea[] = [];
  public rangos:Rango[]=[];
  public aulasAux: Aula[] = [];
  public subareasAux: Subarea[] = [];
  public docente!: Docente;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public ciclonombre: string = "";
  public docentenombre: string = "";
  public alumnonombre: string = "";
  public promediobimestral: number = 0;
  public promediobimestralLetra:string="";
  public matriculas: Matricula[] = [];
  public cargando: boolean = false;
  public apoderado!: Apoderado;
  public alumno!: Alumno;
  public bandBoton: number = 0;
  public mensajeboton: string = "Convertir a Letras";
  public datosAux:any[]=[];

  constructor(private menuService: MenuService, private fb: FormBuilder,
    private cicloService: CicloService, private periodoService: PeriodoService,
    private matriculaService: MatriculaService,
    private evaluacionService: EvaluacionService, private institucionService: InstitucionService,
    private aulaService: AulaService, private subareaService: SubareaService,
    private usuarioService: UsuarioService, private programacionService: ProgramacionService,
    private rangoService:RangoService) {

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
    this.rangoService.todo().subscribe(({ok,rangos})=>{
      if(ok){
        this.rangos= rangos;
      }
    });

    if (this.usuarioService.usuario.role.nombre === "DOCENTE") {


      /*
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
      */

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

    if (this.usuarioService.usuario.role.nombre === "ALUMNO") {

      this.usuarioService.alumnoPorPersona().subscribe({
        next: ({ ok, alumno }) => {
          if (ok) {
            this.alumno = alumno;
            
            this.matriculaService.matriculasPorAlumnoReporte(Number(this.alumno.id))
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
              })
          }
        }
      })
    }

    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.repForm = this.fb.group({
      periodoId: ['', Validators.required],
      cicloId: ['', Validators.required],
      aulaId: ['', Validators.required],
      subareaId: ['', Validators.required],
      matriculaId: ['', Validators.required]
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
    if (this.repForm.get('periodoId')?.value && this.repForm.get('aulaId')?.value &&
      this.repForm.get('subareaId')?.value) {
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.repForm.get('subareaId')?.value).split(',');


      if (this.usuarioService.usuario.role.nombre === "APODERADO") {

        this.matriculaService.matriculasPeriodoAulaSubareaApoderado(
          Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]),
          Number(this.apoderado.id)).subscribe({
            next: ({ ok, matriculas }) => {
              if (ok) {
                this.matriculas = matriculas;
                this.repForm.controls['matriculaId'].setValue("");
              }
            }
          });

      } else {

        if(this.usuarioService.usuario.role.nombre==="ALUMNO"){

          this.matriculaService.matriculasPeriodoAulaSubareaApoderado(
            Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]),
            Number(this.alumno.padreId)).subscribe({
              next: ({ ok, matriculas }) => {
                if (ok) {
                  this.matriculas = matriculas;
                  this.repForm.controls['matriculaId'].setValue("");
                }
              }
            });

        }else{
          this.matriculaService.matriculasPeriodoAulaSubarea(
            Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]))
            .subscribe({
              next: ({ ok, matriculas }) => {
                if (ok) {
                  this.matriculas = matriculas;
                  this.repForm.controls['matriculaId'].setValue("");
                }
              }
            });
        }
      }
    }
  }


  retornaPromedio(objetos: any[]) {
    let p = 0;
    let tipo = "";
    let total = 0;
    let promedios: any[] = [];
    this.evaluaciones.forEach(evaluacion => {
      p = 0;
      tipo = evaluacion.nombre;
      total = 0;
      objetos.forEach(objeto => {
        if (objeto.evaluacion.id == evaluacion.id) {
          p = p + objeto.valor;
          total = total + 1;
        }
      });
      let pt = {};
      if (total > 0) {
        pt = {
          promedio: Math.round(p / total),
          tipo: tipo
        }
      } else {
        pt = {
          promedio: 0,
          tipo: tipo
        }
      }
      promedios.push(pt);
    });
    return promedios;
  }

  calculaPromedio(vector: any[], evaluacionId: number) {
    let p = 0;
    let total = 0;
    let promedio = 0;
    vector.forEach(objeto => {
      if (objeto.evaluacion.id == evaluacionId) {
        p = p + objeto.valor;
        total = total + 1;
      }
    });
    if (total > 0) {
      promedio = Math.round(p / total);
    }
    return promedio;
  }

  calculaPromedioBimestral(vector: any[]) {
    let pb = 0;
    let pbt = 0;
    vector.forEach(vec => {
      pb = pb + vec.promedioevaluacion;
    });

    pbt = Math.round(pb / this.promedios.length);
    return pbt;
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
      alias:""
    };
    this.rangos.forEach(rango => {
      if (valor >= rango.inicio && valor <= rango.fin) {
        retorno = {
          letra: rango.letra,
          situacion: rango.situacion,
          alias:rango.alias
        };
      }
    });
    return retorno;
  }

  buscarNotas() {

    /*
    this.formSubmitted = true;
    if (this.repForm.valid) {
      this.datos = [];
      this.promedios = [];

      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.repForm.get('subareaId')?.value).split(',');
      let arrciclos = (this.repForm.get('cicloId')?.value).split(',');
      let arrmatriculas = (this.repForm.get('matriculaId')?.value).split(',');

      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.subareanombre = arrSubareas[1];
      this.ciclonombre = arrciclos[1];

      this.cargando = true;

      this.matriculaService.obtenerMatriculaCiclo(
        Number(arrmatriculas[0]), Number(arrciclos[0]))
        .subscribe({
          next: ({ ok, matricula }) => {
            if (ok) {
              this.datos = matricula.nota;
              
              this.datosAux=[];

              this.datos.forEach(dato=>{
        
                let retornoA=this.obtenerLetra(dato.valor);
                let objetodato={
                  fecha: dato.fecha,
                  ciclo: dato.ciclo?.nombre,
                  subarea: this.subareanombre,
                  evaluacion: dato.evaluacion?.nombre,
                  valor: dato.valor,
                  letra: retornoA.letra,
                  situacion: retornoA.situacion,
                  alias: retornoA.alias
                }
                this.datosAux.push(objetodato);
              });


              let promEval=0;
    
              this.evaluaciones.forEach(evaluacion => {
                promEval=this.calculaPromedio(this.datos, Number(evaluacion.id));
     
                let retornoB=this.obtenerLetra(promEval);
                let promedio = {
                  evaluacionObj: evaluacion,
                  promedioevaluacion: promEval,
                  promEvalLetra: retornoB.letra,
                  promEvalSituacion:retornoB.situacion,
                  alias: retornoB.alias
                }
                this.promedios.push(promedio);
              });

              this.docentenombre = matricula.programacion?.docente?.persona?.nombres! + ' ' +
                matricula.programacion?.docente?.persona?.apellidopaterno + ' ' +
                matricula.programacion?.docente?.persona?.apellidomaterno;
              this.alumnonombre = matricula.alumno?.persona?.nombres! + ' ' +
                matricula.alumno?.persona?.apellidopaterno! + ' ' +
                matricula.alumno?.persona?.apellidomaterno!;
            
              this.promediobimestral = this.calculaPromedioBimestral(this.promedios);
              
              let retornoC= this.obtenerLetra(this.promediobimestral);
              this.promediobimestralLetra= retornoC.letra;
              
              this.cargando = false;
            }
          }
        });
    }
    */
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

      if(this.bandBoton==0){
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
                { text: 'ALUMNO: ', bold: true, }, this.alumnonombre
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
                { text: 'PROMEDIO BIMESTRAL: ', bold: true, }, this.promediobimestral
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
              text: [
                { text: 'LISTA DE NOTAS: ', bold: true, }
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
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto','auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'FECHA', bold: true, alignment: 'center' },
                    { text: 'CICLO', bold: true, alignment: 'center' },
                    { text: 'EVALUACIÓN', bold: true, alignment: 'center' },
                    { text: 'NOTA', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' }
                  ],
                  ...this.datosAux.map(p => (
                    [
                      this.datosAux.indexOf(p) + 1,
                      p.fecha,
                      p.ciclo,
                      p.evaluacion,
                      p.valor,
                      p.situacion
                    ])),
                ]
              }
            },
  
            {
              text: [
                { text: 'PROMEDIOS: ', bold: true, }
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
                widths: ['auto', 'auto', 'auto','auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'EVALUACIÓN', bold: true, alignment: 'center' },
                    { text: 'PROMEDIO', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' }
                  ],
                  ...this.promedios.map(p => (
                    [
                      this.promedios.indexOf(p) + 1,
                      p.evaluacionObj.nombre,
                      p.promedioevaluacion,
                      p.promEvalSituacion
                    ])),
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
                { text: 'ALUMNO: ', bold: true, }, this.alumnonombre
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
                { text: 'PROMEDIO BIMESTRAL: ', bold: true, }, this.promediobimestralLetra
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
              text: [
                { text: 'LISTA DE NOTAS: ', bold: true, }
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
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto','auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'FECHA', bold: true, alignment: 'center' },
                    { text: 'CICLO', bold: true, alignment: 'center' },
                    { text: 'EVALUACIÓN', bold: true, alignment: 'center' },
                    { text: 'NOTA', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' }
                  ],
                  ...this.datosAux.map(p => (
                    [
                      this.datosAux.indexOf(p) + 1,
                      p.fecha,
                      p.ciclo,
                      p.evaluacion,
                      p.letra,
                      p.situacion
                    ])),
                ]
              }
            },
  
            {
              text: [
                { text: 'PROMEDIOS: ', bold: true, }
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
                widths: ['auto', 'auto', 'auto','auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'EVALUACIÓN', bold: true, alignment: 'center' },
                    { text: 'PROMEDIO', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' }
                  ],
                  ...this.promedios.map(p => (
                    [
                      this.promedios.indexOf(p) + 1,
                      p.evaluacionObj.nombre,
                      p.promEvalLetra,
                      p.promEvalSituacion
                    ])),
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
