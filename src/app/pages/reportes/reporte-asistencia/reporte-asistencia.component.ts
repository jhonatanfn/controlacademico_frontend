import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
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
import { Docente } from 'src/app/models/docente.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { MatriculaService } from 'src/app/services/matricula.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte-asistencia',
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css']
})
export class ReporteAsistenciaComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Alumnos';
  public icono2: string = 'bi bi-people-fill';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public asisForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public evaluaciones: Evaluacion[] = [];
  @ViewChild('htmlData') htmlData!: ElementRef;
  public asistio: number = 0;
  public falto: number = 0;
  public justifico: number = 0;
  public total: number = 0;
  public institucion!: Institucion;
  public aulas: Aula[] = [];
  public subareas: Subarea[] = [];
  public aulasAux: Aula[] = [];
  public subareasAux: Subarea[] = [];
  public docente!: Docente;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public docentenombre: string = "";
  public cargando: boolean = false;
  public apoderado!: Apoderado;

  constructor(private menuService: MenuService, private fb: FormBuilder,
    private periodoService: PeriodoService, private asistenciaService: AsistenciaService,
    private institucionService: InstitucionService, private aulaService: AulaService,
    private subareaService: SubareaService, private usuarioService: UsuarioService,
    private programacionService: ProgramacionService,
    private matriculaService: MatriculaService) {
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

    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.asisForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      subareaId: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarAsistencias() {
    this.formSubmitted = true;
    if (this.asisForm.valid) {
      this.datos = [];
      let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.asisForm.get('aulaId')?.value).split(',');
      let arrSubareas = (this.asisForm.get('subareaId')?.value).split(',');

      this.periodonombre = arrPeriodos[1];
      this.aulanombre = arrAulas[1];
      this.subareanombre = arrSubareas[1];
      this.cargando = true;


      if (this.usuarioService.usuario.role.nombre === "APODERADO") {

        this.asistenciaService.asistenciasPeriodoAulaSubareaFechaApoderado(
          Number(arrPeriodos[0]),
          Number(arrAulas[0]),
          Number(arrSubareas[0]),
          this.asisForm.get('fecha')?.value,
          Number(this.apoderado.id)).subscribe({
            next: ({ ok, asistencias }) => {
              if (ok) {
                this.datos = asistencias;
                if (asistencias.length > 0) {
                  this.docentenombre = asistencias[0].matricula?.programacion?.docente?.persona?.nombres! + ' ' +
                    asistencias[0].matricula?.programacion?.docente?.persona?.apellidopaterno! + ' ' +
                    asistencias[0].matricula?.programacion?.docente?.persona?.apellidomaterno!;
                  this.calcularTotales();
                }
                this.cargando = false;
              }
            }
          });

      } else {

        this.asistenciaService.asistenciasPeriodoAulaSubareaFecha(
          Number(arrPeriodos[0]),
          Number(arrAulas[0]),
          Number(arrSubareas[0]),
          this.asisForm.get('fecha')?.value).subscribe({
            next: ({ ok, asistencias }) => {
              if (ok) {
                this.datos = asistencias;
                if (asistencias.length > 0) {
                  this.docentenombre = asistencias[0].matricula?.programacion?.docente?.persona?.nombres! + ' ' +
                    asistencias[0].matricula?.programacion?.docente?.persona?.apellidopaterno! + ' ' +
                    asistencias[0].matricula?.programacion?.docente?.persona?.apellidomaterno!;
                  this.calcularTotales();
                }
                this.cargando = false;
              }
            }
          });
      }
    }
  }

  calcularTotales() {
    let asis = 0;
    let fal = 0;
    let jus = 0;
    this.datos.forEach(dato => {
      if (dato.situacionId == 4) {
        fal = fal + 1;
      }
      if (dato.situacionId == 14) {
        asis = asis + 1;
      }
      if (dato.situacionId == 24) {
        jus = jus + 1;
      }
    });

    this.asistio = asis;
    this.falto = fal;
    this.justifico = jus;
    this.total = this.datos.length;
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
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'AP. PATERNO', bold: true, alignment: 'center' },
                  { text: 'AP. MATERNO', bold: true, alignment: 'center' },
                  { text: 'NOMBRES', bold: true, alignment: 'center' },
                  { text: 'FECHA', bold: true, alignment: 'center' },
                  { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                ],
                ...this.datos.map(p => (
                  [
                    this.datos.indexOf(p) + 1,
                    p.matricula.alumno.persona.apellidopaterno,
                    p.matricula.alumno.persona.apellidomaterno,
                    p.matricula.alumno.persona.nombres,
                    moment(p.fecha).format('DD/MM/yyyy'),
                    p.situacion.nombre
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
                  'ASISTIÓ: ', this.asistio,
                ],
                [
                  'FALTÓ: ', this.falto
                ],
                [
                  'JUSTIFICÓ: ', this.justifico
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











  /*
    async generarPdf(){
      const pdf = new PdfMakeWrapper();
      pdf.header(
        new Txt('I.E.P JOHANNES GUTEMBERG').alignment('left').end
      );
      pdf.pageMargins([ 40, 15, 40, 60 ]);
      pdf.pageSize('A4');
  
      pdf.add(
        new Table([
          [
            new Columns([ await new Img('../../../../assets/img/logoreporte.jpg')
            .build()]).end,
            new Columns([ 
              new Txt('REPORTE DE ASISTENCIA')
              .margin([0,20,20,20])
              .bold()
              .fontSize(15)
              .alignment('center').end ]).alignment('center').end,
          ]
        ])
        .widths([60,430])
        .layout('lightHorizontalLines')
        .end
      );
      pdf.add(
        pdf.ln(1)
      );
      pdf.add(this.createTable(this.datos));
      
      pdf.footer(
        new Txt('Página 1 de 1').alignment('right').margin([10,10]).end
      );
      pdf.create().open();
    }
  
    createTable(data:any[]){
      return new Table([
        ['Alumno','Fecha','Situacion'],
        ...this.extracData(data)
      ])
      .widths([300,60,60])
      .heights( rowIndex=>{
        return rowIndex === 0 ? 20 : 0
      })
      .layout({
        fillColor: (rowIndex?:number,node?:any,columnIndex?:number) => {
          return rowIndex === 0 ? '#CCCCCC' : ''
        }
      })
      .end;
    }
  
    extracData(data:any[]){
      return data.map(row=>[
        row.alumno.persona.apellidopaterno+' '+
        row.alumno.persona.apellidomaterno+' '+
        row.alumno.persona.nombres,
        row.asistencia[0].fecha,
        row.asistencia[0].situacion
      ]);
    }
  
    */


















  /*
  descargarPdf(){
    
    const DATA:any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_notas.pdf`);
    });
    
  }
*/
}
