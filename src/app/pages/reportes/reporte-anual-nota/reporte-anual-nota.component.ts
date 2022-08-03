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
import { Docente } from 'src/app/models/docente.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Rango } from 'src/app/models/rango.model';
import { RangoService } from 'src/app/services/rango.service';
@Component({
  selector: 'app-reporte-anual-nota',
  templateUrl: './reporte-anual-nota.component.html',
  styleUrls: ['./reporte-anual-nota.component.css']
})
export class ReporteAnualNotaComponent implements OnInit {

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
  public rangos: Rango[]=[];
  public aulasAux: Aula[] = [];
  public subareasAux: Subarea[] = [];
  public docente!: Docente;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public ciclonombre: string = "";
  public docentenombre: string = "";
  public aprobados: number = 0;
  public desaprobados: number = 0;
  public total: number = 0;
  public cargando: boolean = false;
  public apoderado!: Apoderado;
  public bandBoton: number = 0;
  public mensajeboton: string = "Convertir a Letras";

  constructor(private menuService: MenuService, private fb: FormBuilder,
    private cicloService: CicloService, private periodoService: PeriodoService, private matriculaService: MatriculaService,
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
    })

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
      aulaId: ['', Validators.required],
      subareaId: ['', Validators.required]
    });
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

  campoRequerido(campo: string) {
    if (this.repForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  retornaPromedioBimestral(objetos: any[], cId: number, cName = "") {
    let p = 0;
    let tipo = "";
    let bimestre = "";
    let total = 0;
    let promedios: any[] = [];
    let sumabimestral = 0;
    let prombimestral = 0;
    this.evaluaciones.forEach(evaluacion => {
      p = 0;
      tipo = evaluacion.nombre;
      total = 0;
      bimestre = cName;
      objetos.forEach(objeto => {
        if (objeto.evaluacion.id == evaluacion.id && objeto.ciclo.id === cId) {
          p = p + objeto.valor;
          total = total + 1;
        }
      });
      let pt = {};
      if (total > 0) {
        pt = {
          promedio: Math.round(p / total),
          tipo: tipo,
          bimestre: bimestre
        }
      } else {
        pt = {
          promedio: 0,
          tipo: tipo,
          bimestre: bimestre
        }
      }
      promedios.push(pt);
    });
    promedios.forEach(obj => {
      sumabimestral = sumabimestral + obj.promedio;
    });
    prombimestral = Math.round(sumabimestral / promedios.length);
    return prombimestral;
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

  buscarNotas() {
    this.formSubmitted = true;

    if (this.repForm.valid) {
      this.datos = [];
      let arrPeriodos = (this.repForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.repForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.repForm.get('subareaId')?.value).split(',');
      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.subareanombre = arrSubareas[1];
      let aprobo = 0;
      let desaprobo = 0;
      this.cargando = true;

      if (this.usuarioService.usuario.role.nombre === "APODERADO") {

        this.matriculaService.matriculasAnualApoderado(
          Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]),
          Number(this.apoderado.id))
          .subscribe({
            next: ({ ok, matriculas }) => {
              if (ok) {

                let i = 0;

                let promedio1=0;
                let promedio2=0;
                let promedio3=0;
                let promedio4=0;
                let promedio1L="";
                let promedio2L="";
                let promedio3L="";
                let promedio4L="";

                matriculas.forEach(matricula => {
                  let vectorNotas = matricula.nota;
                  i = i + 1;

                  promedio1=this.retornaPromedioBimestral(vectorNotas, 4, "I BIMESTRE");
                  promedio2=this.retornaPromedioBimestral(vectorNotas, 14, "II BIMESTRE");
                  promedio3=this.retornaPromedioBimestral(vectorNotas, 24, "III BIMESTRE");
                  promedio4=this.retornaPromedioBimestral(vectorNotas, 34, "IV BIMESTRE");
                  
                  promedio1L= this.retornLetra(promedio1);
                  promedio2L= this.retornLetra(promedio2);
                  promedio3L= this.retornLetra(promedio3);
                  promedio4L= this.retornLetra(promedio4);

                  let detalle = {
                    indice: i,
                    matriculaObj: matricula,
                    promedio1: promedio1,
                    promedio1L: promedio1L,
                    promedio2: promedio2,
                    promedio2L: promedio2L,
                    promedio3: promedio3,
                    promedio3L: promedio3L,
                    promedio4: promedio4,
                    promedio4L: promedio4L,
                    promedioTotal: 0,
                    promedioTotalLetra: "",
                    situacionLetra:"",
                    alias:""
                  }
                  detalle.promedioTotal = Math.round((detalle.promedio1 + detalle.promedio2 + detalle.promedio3 + detalle.promedio4) / 4);
                  if (detalle.promedioTotal >= 11) {
                    aprobo = aprobo + 1;
                  } else {
                    desaprobo = desaprobo + 1;
                  }

                  let retornoA= this.obtenerLetra(detalle.promedioTotal);
                  detalle.promedioTotalLetra=retornoA.letra;
                  detalle.situacionLetra=retornoA.situacion;
                  detalle.alias= retornoA.alias;

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

        this.matriculaService.matriculasAnual(
          Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]))
          .subscribe({
            next: ({ ok, matriculas }) => {
              if (ok) {
                let i = 0;

                let promedio1=0;
                let promedio2=0;
                let promedio3=0;
                let promedio4=0;
                let promedio1L="";
                let promedio2L="";
                let promedio3L="";
                let promedio4L="";

                matriculas.forEach(matricula => {
                  let vectorNotas = matricula.nota;
                  i = i + 1;

                  promedio1=this.retornaPromedioBimestral(vectorNotas, 4, "I BIMESTRE");
                  promedio2=this.retornaPromedioBimestral(vectorNotas, 14, "II BIMESTRE");
                  promedio3=this.retornaPromedioBimestral(vectorNotas, 24, "III BIMESTRE");
                  promedio4=this.retornaPromedioBimestral(vectorNotas, 34, "IV BIMESTRE");
                  
                  promedio1L= this.retornLetra(promedio1);
                  promedio2L= this.retornLetra(promedio2);
                  promedio3L= this.retornLetra(promedio3);
                  promedio4L= this.retornLetra(promedio4);

                  let detalle = {
                    indice: i,
                    matriculaObj: matricula,
                    promedio1: promedio1,
                    promedio1L: promedio1L,
                    promedio2: promedio2,
                    promedio2L: promedio2L,
                    promedio3: promedio3,
                    promedio3L: promedio3L,
                    promedio4: promedio4,
                    promedio4L: promedio4L,
                    promedioTotal: 0,
                    promedioTotalLetra: "",
                    situacionLetra:"",
                    alias:""
                  }
                  detalle.promedioTotal = Math.round((detalle.promedio1 + detalle.promedio2 + detalle.promedio3 + detalle.promedio4) / 4);
                  if (detalle.promedioTotal >= 11) {
                    aprobo = aprobo + 1;
                  } else {
                    desaprobo = desaprobo + 1;
                  }

                  let retornoB=this.obtenerLetra(detalle.promedioTotal);
                  detalle.promedioTotalLetra=retornoB.letra;
                  detalle.situacionLetra=retornoB.situacion;
                  detalle.alias= retornoB.alias;

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
    }
  }

  retornLetra(promedio:any){

    let letra="";
    let obj= this.obtenerLetra(promedio);
    letra= obj.letra;
    return letra;
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
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'APELLIDOS Y NOMBRES', bold: true, alignment: 'center' },
                    { text: 'IB', bold: true, alignment: 'center' },
                    { text: 'IIB', bold: true, alignment: 'center' },
                    { text: 'IIIB', bold: true, alignment: 'center' },
                    { text: 'IVB', bold: true, alignment: 'center' },
                    { text: 'PROMEDIO', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.matriculaObj.alumno.persona.apellidopaterno+' '
                      +p.matriculaObj.alumno.persona.apellidomaterno+' '
                      +p.matriculaObj.alumno.persona.nombres,               
                      p.promedio1,
                      p.promedio2,
                      p.promedio3,
                      p.promedio4,
                      { text: p.promedioTotal, alignment: 'center' },
                      { text: p.situacionLetra, alignment: 'center' }
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
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'APELLIDOS Y NOMBRES', bold: true, alignment: 'center' },
                    { text: 'IB', bold: true, alignment: 'center' },
                    { text: 'IIB', bold: true, alignment: 'center' },
                    { text: 'IIIB', bold: true, alignment: 'center' },
                    { text: 'IVB', bold: true, alignment: 'center' },
                    { text: 'PROMEDIO', bold: true, alignment: 'center' },
                    { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  ],
                  ...this.datos.map(p => (
                    [
                      this.datos.indexOf(p) + 1,
                      p.matriculaObj.alumno.persona.apellidopaterno+' '
                      +p.matriculaObj.alumno.persona.apellidomaterno+' '
                      +p.matriculaObj.alumno.persona.nombres,               
                      p.promedio1L,
                      p.promedio2L,
                      p.promedio3L,
                      p.promedio4L,
                      { text: p.promedioTotalLetra, alignment: 'center' },
                      { text: p.situacionLetra, alignment: 'center' }
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
