import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import * as  moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { Aula } from 'src/app/models/aula.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AulaService } from 'src/app/services/aula.service';
import { SubareaService } from 'src/app/services/subarea.service';
import { Matricula } from 'src/app/models/matricula.model';
import { MatriculaService } from 'src/app/services/matricula.service';
import { Docente } from 'src/app/models/docente.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Alumno } from 'src/app/models/alumno.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte-asistencia-alumno',
  templateUrl: './reporte-asistencia-alumno.component.html',
  styleUrls: ['./reporte-asistencia-alumno.component.css']
})
export class ReporteAsistenciaAlumnoComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Lista de Asistencias';
  public icono2: string = 'bi bi-calendar-check';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public asisForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public evaluaciones: Evaluacion[] = [];
  @ViewChild('htmlData') htmlData!: ElementRef;
  public asistiototal: number = 0;
  public faltototal: number = 0;
  public justificototal: number = 0;
  public norgistradototal: number = 0;
  public institucion!: Institucion;
  public aulas: Aula[] = [];
  public subareas: Subarea[] = [];
  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public docentenombre: string = "";
  public alumnonombre: string = "";
  public fechai: string = "";
  public fechaf: string = "";
  public aulasAux: Aula[] = [];
  public subareasAux: Subarea[] = [];
  public docente!: Docente;
  public matriculas: Matricula[] = [];
  public cargando: boolean = false;
  public apoderado!: Apoderado;
  public alumno!: Alumno;

  constructor(private menuService: MenuService, private fb: FormBuilder,
    private periodoService: PeriodoService, private asistenciaService: AsistenciaService,
    private institucionService: InstitucionService, private aulaService: AulaService,
    private subareaService: SubareaService, private matriculaService: MatriculaService,
    private usuarioService: UsuarioService,
    private programacionService: ProgramacionService) {
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
    this.asisForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      subareaId: ['', Validators.required],
      fechainicial: ['', Validators.required],
      fechafinal: ['', Validators.required],
      matriculaId: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  cargarMatriculas() {
    if (this.asisForm.get('periodoId')?.value && this.asisForm.get('aulaId')?.value &&
      this.asisForm.get('subareaId')?.value) {
      let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.asisForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.asisForm.get('subareaId')?.value).split(',');

      this.datos=[];
      if (this.usuarioService.usuario.role.nombre === "APODERADO") {

        this.matriculaService.matriculasPeriodoAulaSubareaApoderado(
          Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]), Number(this.apoderado.id)
        )
          .subscribe({
            next: ({ ok, matriculas }) => {
              if (ok) {
                this.matriculas = matriculas;
                this.asisForm.controls['matriculaId'].setValue("");
              }
            }
          });

      } else {

        if (this.usuarioService.usuario.role.nombre === "ALUMNO") {

          this.matriculaService.matriculasPeriodoAulaSubareaApoderado(
            Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0]),
            Number(this.alumno.apoderadoId)).subscribe({
              next: ({ ok, matriculas }) => {
                if (ok) {
                  this.matriculas = matriculas;
                  this.asisForm.controls['matriculaId'].setValue("");
                }
              }
            });

        } else {
          this.matriculaService.matriculasPeriodoAulaSubarea(
            Number(arrPeriodos[0]), Number(arrAulas[0]), Number(arrSubareas[0])
          )
            .subscribe({
              next: ({ ok, matriculas }) => {
                if (ok) {
                  this.matriculas = matriculas;
                  
                  this.asisForm.controls['matriculaId'].setValue("");
                }
              }
            });
        }
      }
    }
  }



  buscarAsistencias() {
    this.formSubmitted = true;
    if (this.asisForm.valid) {
      this.datos = [];
      let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.asisForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.asisForm.get('subareaId')?.value).split(',');
      let arrMatriculas = (this.asisForm.get('matriculaId')?.value).split(',');

      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.subareanombre = arrSubareas[1];
      this.fechai = this.asisForm.get('fechainicial')?.value;
      this.fechaf = this.asisForm.get('fechafinal')?.value;
      this.alumnonombre = arrMatriculas[1]+' '+arrMatriculas[2]+' '+arrMatriculas[3];
      this.docentenombre = arrMatriculas[4]+' '+arrMatriculas[5]+' '+arrMatriculas[6];

      this.cargando = true;
      this.asistenciaService.asistenciasRangoMatricula(
        Number(arrPeriodos[0]),
        Number(arrAulas[0]),
        Number(arrSubareas[0]),
        Number(arrMatriculas[0]),
        this.asisForm.get('fechainicial')?.value,
        this.asisForm.get('fechafinal')?.value).subscribe({
          next: ({ ok, asistencias }) => {
            if (ok) {
              //if (asistencias.length > 0) {
                
                const fecha1 = new Date(this.asisForm.get('fechainicial')?.value).getTime();
                const fecha2 = new Date(this.asisForm.get('fechafinal')?.value).getTime();
                let result = (fecha2 - fecha1) / (1000 * 60 * 60 * 24);
                
                for (let i = 0; i <= result; i++) {
                  let fecha = moment(this.asisForm.get('fechainicial')?.value).add(i, 'days').format('YYYY-MM-DD');
                  let retorno= this.retornaObjetoAsistencia(fecha,asistencias);
                  let obj = {
                    fecha: retorno.fecha,
                    asistio: retorno.asis,
                    falto: retorno.fal,
                    justifico: retorno.jus,
                    noregistrado: retorno.nreg,
                    etiquetaA: retorno.etiqa,
                    etiquetaF: retorno.etiqf,
                    etiquetaJ: retorno.etiqj,
                    etiquetaNR: retorno.etiqnoreg,
                    situation: retorno.situation
                  }
                  this.datos.push(obj);
                }
                

                let ast = 0;
                let fat = 0;
                let just = 0;
                let nregs = 0;
                this.datos.forEach(dato => {
                  ast = ast + dato.asistio;
                  fat = fat + dato.falto;
                  just = just + dato.justifico;
                  nregs = nregs + dato.noregistrado;
                });
                this.asistiototal = ast;
                this.faltototal = fat;
                this.justificototal = just;
                this.norgistradototal = nregs;
              //}
              this.cargando = false;
            }
          }
        });
    }
  }

  limpiar(){
    this.datos=[];
  }
  retornaObjetoAsistencia(fecha: any, vector: any[]) {
    let objeto = {
      fecha: fecha,
      asis: 0,
      fal: 0,
      jus: 0,
      nreg: 1,
      etiqa: "",
      etiqf: "",
      etiqj: "",
      etiqnoreg: "NO REGISTRÓ",
      situation: "NO REGISTRÓ",
    }
    vector.forEach(item=>{
      if(item.fecha===fecha){
        if (item.situacion?.id == 4) {
          objeto={
            fecha: fecha,
            asis: 0,
            fal: 1,
            jus: 0,
            nreg: 0,
            etiqa: "",
            etiqf: "FALTÓ",
            etiqj: "",
            etiqnoreg: "",
            situation: "FALTÓ",
          }
        }
        if (item.situacion?.id == 14) {
          objeto={
            fecha: fecha,
            asis: 1,
            fal: 0,
            jus: 0,
            nreg: 0,
            etiqa: "ASISTIÓ",
            etiqf: "",
            etiqj: "",
            etiqnoreg: "",
            situation: "ASISTIÓ",
          }
        }
        if (item.situacion?.id == 24) {
          objeto={
            fecha: fecha,
            asis: 0,
            fal: 0,
            jus: 1,
            nreg: 0,
            etiqa: "",
            etiqf: "",
            etiqj: "JUSTIFICÓ",
            etiqnoreg: "",
            situation: "JUSTIFICÓ",
          }
        }
      }
    });

    return objeto;
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
      let arrSubareas = (this.asisForm.get('subareaId')?.value).split(',');

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
              { text: 'AULA: ', bold: true, }, arrAulas[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'SUBAREA: ', bold: true }, arrSubareas[1]
            ],
            fontSize: 12,
            color: '#0000',
            width: 'auto',
            margin: [0, 1, 0, 1],
          },
          {
            text: [
              { text: 'DOCENTE: ', bold: true }, this.docentenombre
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
            //layout: 'lightHorizontalLines',
            margin: [0, 10, 0, 15],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'FECHA', bold: true, alignment: 'center' },
                  { text: 'SUBAREA', bold: true, alignment: 'center' },
                  { text: 'ALUMNO', bold: true, alignment: 'center' },
                  { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                ],
                ...this.datos.map(p => (
                  [
                    this.datos.indexOf(p) + 1,
                    moment(p.fecha).format('DD/MM/yyyy'),
                    { text: this.subareanombre, alignment: 'center' },
                    { text: this.alumnonombre, alignment: 'center' },
                    { text: p.situation, alignment: 'center' },
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
                  'ASISTIÓ: ', this.asistiototal,
                ],
                [
                  'FALTÓ: ', this.faltototal
                ],
                [
                  'JUSTIFICÓ: ', this.justificototal
                ],
                [
                  'NO REGISTRÓ: ', this.norgistradototal
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
