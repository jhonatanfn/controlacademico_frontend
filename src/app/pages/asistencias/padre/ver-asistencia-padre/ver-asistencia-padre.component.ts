import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Alumno } from 'src/app/models/alumno.model';
import { Aula } from 'src/app/models/aula.model';
import { Institucion } from 'src/app/models/institucion.model';
import { Periodo } from 'src/app/models/periodo.model';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AulaService } from 'src/app/services/aula.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { SituacionService } from 'src/app/services/situacion.service';
import { Situacion } from 'src/app/models/situacion.model';
import { Padre } from 'src/app/models/padre.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ver-asistencia-padre',
  templateUrl: './ver-asistencia-padre.component.html',
  styleUrls: ['./ver-asistencia-padre.component.css']
})
export class VerAsistenciaPadreComponent implements OnInit {

  public titulo: string = 'Buscar';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Resultado';
  public icono2: string = 'bi bi-pin-angle';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-paperclip';
  public asisForm!: FormGroup;
  public formSubmitted: boolean = false;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public aulasAux: Aula[] = [];
  public alumno!: Alumno;
  public datos: any[] = [];
  public cargando: boolean = false;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public alumnonombre: string = "";
  public fechai: string = "";
  public fechaf: string = "";
  public institucion!: Institucion;
  public resumenes: any[] = [];
  public situaciones: Situacion[] = [];
  public alumnos: Alumno[] = [];
  public padre!: Padre;

  constructor(private fb: FormBuilder, private periodoService: PeriodoService,
    private usuarioService: UsuarioService, private asistenciaService: AsistenciaService, 
    private institucionService: InstitucionService, private situacionService: SituacionService, 
    private alumnoService: AlumnoService, private matriculadetalleService: MatriculadetalleService) {

    this.periodoService.todo().subscribe({
      next: ({ ok, periodos }) => {
        if (ok) {
          this.periodos = periodos;
        }
      }
    });
    this.situacionService.todo().subscribe(({ ok, situaciones }) => {
      if (ok) {
        this.situaciones = situaciones;
      }
    });
    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.asisForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      alumnoId: ['', Validators.required],
      fechainicial: ['', Validators.required],
      fechafinal: ['', Validators.required],
    });
    this.usuarioService.padrePorPersona().subscribe(({ ok, padre }) => {
      if (ok) {
        this.padre = padre;
        this.alumnoService.listaAlumnosPorPadre(Number(padre.id)).subscribe({
          next: ({ ok, alumnos }) => {
            if (ok) {
              this.alumnos = alumnos;
            }
          }
        });
      }
    });
  }
  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  listarAulas() {
    let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
    this.aulas = [];
    this.aulasAux = [];
    this.matriculadetalleService.matriculadetallesAlumnoPadre(Number(this.padre.id), Number(arrPeriodos[0]))
      .subscribe(({ ok, matriculadetalles }) => {
        if (ok) {
          if (matriculadetalles.length > 0) {
            var lookupObject: any = {};
            matriculadetalles.forEach(matriculadetalle => {
              this.aulasAux.push(matriculadetalle.programacion?.aula!);
            });
            for (var i in this.aulasAux) {
              lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
            }
            for (i in lookupObject) {
              this.aulas.push(lookupObject[i]);
            }
          }
        }
      });
  }

  buscarAsistencias() {
    this.formSubmitted = true;
    if (this.asisForm.valid) {
      this.cargando = true;
      let arrPeriodos = (this.asisForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.asisForm.get('aulaId')?.value).split(',');
      let arrAlumnos = (this.asisForm.get('alumnoId')?.value).split(',');
      this.datos = [];
      this.asistenciaService.asistenciasAlumno(
        Number(arrPeriodos[0]),
        Number(arrAulas[0]),
        Number(arrAlumnos[0]),
        this.asisForm.get('fechainicial')?.value,
        this.asisForm.get('fechafinal')?.value
      ).subscribe({
        next: ({ ok, asistencias }) => {
          if (ok) {
            const fecha1 = new Date(this.asisForm.get('fechainicial')?.value).getTime();
            const fecha2 = new Date(this.asisForm.get('fechafinal')?.value).getTime();
            let result = (fecha2 - fecha1) / (1000 * 60 * 60 * 24);
            for (let i = 0; i <= result; i++) {
              let fecha = moment(this.asisForm.get('fechainicial')?.value).add(i, 'days').format('YYYY-MM-DD');
              let retorno = this.retornaAsistencia(fecha, asistencias);
              let obj = {
                fecha: retorno.fecha,
                asistio: retorno.asis,
                falto: retorno.fal,
                justifico: retorno.jus,
                tardanza: retorno.tar,
                noregistrado: retorno.nreg,
                etiquetaA: retorno.etiqa,
                etiquetaF: retorno.etiqf,
                etiquetaJ: retorno.etiqj,
                etiquetaT: retorno.etiqt,
                etiquetaNR: retorno.etiqnoreg,
                situation: retorno.situation
              }
              this.datos.push(obj);
            }
            this.calcularResumen(this.datos);
          }
          this.cargando = false;
        }
      });
    }
  }

  calcularResumen(vector: any[]) {
    let totalNotas = vector.length;
    this.resumenes = [];
    this.situaciones.forEach(situacion => {
      let objeto = {
        situacion: situacion,
        total: 0,
        porcentaje: 0,
      }
      this.resumenes.push(objeto);
    });
    vector.forEach(item => {
      this.resumenes.forEach(resumen => {
        if (item.situation === resumen.situacion.nombre) {
          resumen.total = resumen.total + 1;
          resumen.porcentaje = Math.round((resumen.total / totalNotas) * 100);
        }
      });
    });
  }

  retornaAsistencia(fecha: any, vector: any[]) {
    let objeto = {
      fecha: fecha,
      asis: 0,
      fal: 0,
      jus: 0,
      tar: 0,
      nreg: 1,
      etiqa: "",
      etiqf: "",
      etiqj: "",
      etiqt: "",
      etiqnoreg: "NO REGISTRÓ",
      situation: "NO REGISTRÓ",
    }
    vector.forEach(item => {
      if (item.fecha === fecha) {
        if (item.situacion?.id == 4) {
          objeto = {
            fecha: fecha,
            asis: 0,
            fal: 1,
            jus: 0,
            tar: 0,
            nreg: 0,
            etiqa: "",
            etiqf: "FALTÓ",
            etiqj: "",
            etiqt: "",
            etiqnoreg: "",
            situation: "FALTÓ",
          }
        }
        if (item.situacion?.id == 14) {
          objeto = {
            fecha: fecha,
            asis: 1,
            fal: 0,
            jus: 0,
            tar: 0,
            nreg: 0,
            etiqa: "ASISTIÓ",
            etiqf: "",
            etiqj: "",
            etiqt: "",
            etiqnoreg: "",
            situation: "ASISTIÓ",
          }
        }
        if (item.situacion?.id == 24) {
          objeto = {
            fecha: fecha,
            asis: 0,
            fal: 0,
            jus: 1,
            tar: 0,
            nreg: 0,
            etiqa: "",
            etiqf: "",
            etiqj: "JUSTIFICÓ",
            etiqt: "",
            etiqnoreg: "",
            situation: "JUSTIFICÓ",
          }
        }
        if (item.situacion?.id == 34) {
          objeto = {
            fecha: fecha,
            asis: 0,
            fal: 0,
            jus: 0,
            tar: 1,
            nreg: 0,
            etiqa: "",
            etiqf: "",
            etiqj: "",
            etiqt: "TARDANZA",
            etiqnoreg: "",
            situation: "TARDANZA",
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
            margin: [0, 10, 0, 15],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [

                [
                  { text: 'N°', bold: true, alignment: 'center' },
                  { text: 'FECHA', bold: true, alignment: 'center' },
                  { text: '', bold: true, alignment: 'center' },
                  { text: '', bold: true, alignment: 'center' },
                  { text: '', bold: true, alignment: 'center' },
                  { text: '', bold: true, alignment: 'center' },
                  { text: '', bold: true, alignment: 'center' },
                ],
                ...this.datos.map(p => (
                  [
                    this.datos.indexOf(p) + 1,
                    moment(p.fecha).format('DD/MM/yyyy'),
                    { text: p.etiquetaA, alignment: 'center' },
                    { text: p.etiquetaF, alignment: 'center' },
                    { text: p.etiquetaJ, alignment: 'center' },
                    { text: p.etiquetaT, alignment: 'center' },
                    { text: p.etiquetaNR, alignment: 'center' },
                  ])),
              ]
            }
          },
          {
            margin: [0, 1, 0, 5],
            table: {
              widths: ['auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'SITUACIÓN', bold: true, alignment: 'center' },
                  { text: 'TOTAL', bold: true, alignment: 'center' },
                  { text: '%', bold: true, alignment: 'center' },
                ],
                ...this.resumenes.map(p => (
                  [
                    { text: p.situacion.nombre, alignment: 'center' },
                    { text: p.total, alignment: 'center' },
                    { text: p.porcentaje + ' % ', alignment: 'center' },
                  ]))
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
