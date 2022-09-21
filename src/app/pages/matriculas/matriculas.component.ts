import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Matricula } from 'src/app/models/matricula.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {

  public matriculas: Matricula[] = [];
  public matriculadetalles: Matriculadetalle[] = [];
  public cargando: boolean = false;
  public titulo: string = 'Tabla Matriculas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public matricula: any = { dni: "", nombres: "", apellidos: "", img: "", periodonombre: "", aulanombre: "" };
  public institucion!: Institucion;

  constructor(private matriculaService: MatriculaService, private fb: FormBuilder,
    private matriculadetalleService: MatriculadetalleService, private institucionService: InstitucionService) {
    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.listarMatriculas();
  }

  controlBotonesPaginacion() {
    if (this.matriculas.length !== 5) {
      this.ds = true;
    } else {
      this.ds = false;
    }
    if (this.desde === 0) {
      this.da = true;
    } else {
      this.da = false;
    }
  }

  listarMatriculas() {
    this.cargando = true;
    this.matriculaService.listar(this.desde)
      .subscribe({
        next: ({ ok, matriculas, total }) => {
          if (ok) {
            this.matriculas = matriculas;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarMatriculas();
  }

  buscarMatriculas(termino: string) {
    if (termino.length == 0) {
      this.listarMatriculas();
    } else {
      this.matriculaService.busqueda(termino)
        .subscribe({
          next: (resp: Matricula[]) => {
            this.matriculas = resp;
            this.totalRegistros = resp.length;
            this.cargando = false;
            this.controlBotonesPaginacion();
          },
          error: (error) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error.error.msg,
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
    }

  }

  eliminarMatricula(matricula: Matricula) {
    Swal.fire({
      title: 'Eliminar',
      text: "¿Desea eliminar la matricula de: " + matricula.alumno?.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.matriculaService.borrar(Number(matricula.id))
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                });
              }
            }
          });
      }
    });
  }

  detalleMatricula(matricula: Matricula) {
    this.matriculadetalleService.matriculadetalles(Number(matricula.id)).subscribe({
      next: ({ ok, matriculadetalles }) => {
        if (ok) {
          this.matriculadetalles = matriculadetalles;
          this.matricula = {
            dni: matricula.alumno?.persona?.dni,
            nombres: matricula.alumno?.persona?.nombres,
            apellidos: matricula.alumno?.persona?.apellidopaterno + ' ' + matricula.alumno?.persona?.apellidomaterno,
            img: matricula.alumno?.persona?.img,
            periodonombre: this.matriculadetalles[0].programacion?.periodo?.nombre,
            aulanombre: this.matriculadetalles[0].programacion?.aula?.nombre
          };
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

  async imprimirMatricula(accion: string) {

    let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
    let nombreArchivo = 'MATRICULA: ' + moment().format('DD/MM/yyyy') + '.pdf';

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
          text: 'MATRICULA',
          style: ['header'],
          margin: [0, 10, 0, 10],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: 'black'
        },
        {
          text: [
            { text: 'PERIODO: ', bold: true, }, this.matricula.periodonombre
          ],
          fontSize: 12,
          color: '#0000',
          width: 'auto',
          margin: [0, 1, 0, 1],
        },
        {
          text: [
            { text: 'AULA: ', bold: true, }, this.matricula.aulanombre
          ],
          fontSize: 12,
          color: '#0000',
          width: 'auto',
          margin: [0, 1, 0, 1],
        },
        {
          text: [
            { text: 'ALUMNO(A): ', bold: true, }, this.matricula.nombres + ' ' + this.matricula.apellidos
          ],
          fontSize: 12,
          color: '#0000',
          width: 'auto',
          margin: [0, 1, 0, 1],
        },
        {
          text: [
            { text: 'DNI: ', bold: true, }, this.matricula.dni
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
            widths: [30, 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'N°', bold: true, alignment: 'center' },
                { text: 'Area', bold: true, alignment: 'center' },
                { text: 'Docente', bold: true, alignment: 'center' },
                { text: 'Estado', bold: true, alignment: 'center' },
              ],
              ...this.matriculadetalles.map(p => (
                [
                  this.matriculadetalles.indexOf(p) + 1,
                  p.programacion?.area?.nombre,
                  p.programacion?.docente?.persona?.nombres + ' ' + p.programacion?.docente?.persona?.apellidopaterno + ' ' + p.programacion?.docente?.persona?.apellidomaterno,
                  'INSCRITO'
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
