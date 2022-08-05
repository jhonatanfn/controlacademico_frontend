import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alumno } from 'src/app/models/alumno.model';
import { Aula } from 'src/app/models/aula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { AulaService } from 'src/app/services/aula.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';
import * as  moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-crear-matricula',
  templateUrl: './crear-matricula.component.html',
  styleUrls: ['./crear-matricula.component.css']
})
export class CrearMatriculaComponent implements OnInit {

  public titulo1: string = "Matricula";
  public icono1: string = "bi bi-card-text";
  public titulo2: string = "Programaciones";
  public icono2: string = "bi bi-table";
  public titulo3: string = "Buscar Alumno";
  public icono3: string = "bi bi-search";
  public matriculaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public programaciones: Programacion[] = [];
  public alumno: Alumno = {};
  public existeAlumno: boolean = false;
  public messageError: string = "No hay alumno";
  public alumnos: Alumno[] = [];
  selectedAlumno!: any;
  public alumno_numero: string = "";
  public alumno_nombres: string = "";
  public alumno_apellidopaterno: string = "";
  public alumno_apellidomaterno: string = "";
  public printButton: boolean = true;
  public saveButton: boolean = false;
  public institucion!:Institucion;

  constructor(private fb: FormBuilder, 
    private periodoService: PeriodoService, 
    private aulaService: AulaService,
    private programacionService: ProgramacionService,
    private matriculaService: MatriculaService, 
    private alumnoService: AlumnoService,
    private institucionService:InstitucionService) {
    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });
    this.aulaService.todo().subscribe(({ ok, aulas }) => {
      if (ok) {
        this.aulas = aulas;
      }
    });
    this.alumnoService.todo().subscribe({
      next: ({ ok, alumnos }) => {
        if (ok) {
          this.alumnos = alumnos;
        }
      }
    });
    this.institucion= this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.matriculaForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      alumnoId: ['', Validators.required],
      programacionId: ['']
    });
  }

  campoRequerido(campo: string) {
    if (this.matriculaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoInvalido(campo: string) {
    if (this.matriculaForm.get(campo)?.getError && this.formSubmitted && this.existeAlumno == false) {
      return true;
    } else {
      return false;
    }
  }


  alumnoSeleccionado() {
    if (this.selectedAlumno) {
      this.existeAlumno = true;
      this.alumno_numero = this.selectedAlumno[1];
      this.alumno_nombres = this.selectedAlumno[2];
      this.alumno_apellidopaterno = this.selectedAlumno[3];
      this.alumno_apellidomaterno = this.selectedAlumno[4];
      this.matriculaForm.controls['alumnoId'].setValue(this.selectedAlumno[0]);
    } else {
      this.existeAlumno = false;
      this.selectedAlumno = null;
      this.matriculaForm.controls['alumnoId'].setValue('');
    }
    this.programaciones= [];
  }


  buscarAlumno(numero: string) {

    if (numero.length == 8) {

      this.alumnoService.porNumero(numero)
        .subscribe({
          next: ({ ok, alumno }) => {
            if (ok) {
              this.formSubmitted = true;
              this.alumno = alumno;
              this.existeAlumno = true;
              this.matriculaForm.controls['alumnoId'].setValue(this.alumno.id);

              if (this.matriculaForm.valid) {
                let arrAula = (this.matriculaForm.get('aulaId')?.value).split(',');
                this.matriculaService.existeMatricula(this.matriculaForm.get('periodoId')?.value,
                  Number(arrAula[0]), this.matriculaForm.get('alumnoId')?.value)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.messageError = msg;
                    } else {
                      this.programacionService.porPeriodoAula(this.matriculaForm.get('periodoId')?.value,
                        this.matriculaForm.get('aulaId')?.value).subscribe(({ ok, programaciones }) => {
                          if (ok) {
                            this.programaciones = programaciones;
                            this.saveButton = false;
                          }
                        });
                    }
                  });
              }

            }
          },
          error: (err) => {
            this.alumno = {};
            this.existeAlumno = false;
            this.matriculaForm.controls['alumnoId'].setValue('');
          }
        })

    } else {
      this.alumno = {};
      this.messageError = "No hay alumno";
      this.existeAlumno = false;
      this.matriculaForm.controls['alumnoId'].setValue('');
    }
  }


  generarMatricula() {
    this.formSubmitted = true;
    if (this.matriculaForm.valid) {
      let arrAula = (this.matriculaForm.get('aulaId')?.value).split(',');
      this.matriculaService.existeMatricula(this.matriculaForm.get('periodoId')?.value,
        Number(arrAula[0]), this.matriculaForm.get('alumnoId')?.value)
        .subscribe(({ ok, msg }) => {
          if (ok) {
            Swal.fire(msg);
          } else {

            this.programacionService.porPeriodoAula(this.matriculaForm.get('periodoId')?.value,
              this.matriculaForm.get('aulaId')?.value).subscribe(({ ok, programaciones }) => {
                if (ok) {
                  this.programaciones = programaciones;
                  this.saveButton = false;
                }
              });
          }

        });
    }
  }

  guardarMatricula() {

    if (this.matriculaForm.valid) {

      let arrAula = (this.matriculaForm.get('aulaId')?.value).split(',');
      this.matriculaService.existeMatricula(this.matriculaForm.get('periodoId')?.value,
        Number(arrAula[0]), this.matriculaForm.get('alumnoId')?.value)
        .subscribe(({ ok, msg }) => {
          if (ok) {
            Swal.fire(msg);
          } else {

            Swal.fire({
              title: 'Guardar',
              text: "¿Desea crear la matricula?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Guardar'
            }).then((result) => {
              if (result.isConfirmed) {

                this.programaciones.forEach(programacion => {
                  this.matriculaForm.controls['programacionId'].setValue(programacion.id);
                  this.matriculaService.crear(this.matriculaForm.value).subscribe(({ ok }) => {
                    if (ok) { }
                  });
                });
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Matricula creada exitosamente',
                  showConfirmButton: false,
                  timer: 2500
                });
                this.saveButton = true;
              }
            })
          }
        });
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

  async imprimirMatricula(accion: string) {


    if (this.saveButton) {

      this.formSubmitted = true;
      if (this.matriculaForm.valid) {
        let url = this.institucionService.getImageUrlInstitucion(this.institucion.img!);
        let nombreArchivo = 'MATRICULA: ' + moment().format('DD/MM/yyyy') + '.pdf';
        let arrAula = (this.matriculaForm.get('aulaId')?.value).split(',');

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
                { text: 'ALUMNO(A): ', bold: true, }, this.alumno_nombres + ' ' + this.alumno_apellidopaterno + ' ' + this.alumno_apellidomaterno
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 5, 0, 1],
            },
            {
              text: [
                { text: 'N° DOCUMENTO: ', bold: true, }, this.alumno_numero
              ],
              fontSize: 12,
              color: '#0000',
              width: 'auto',
              margin: [0, 1, 0, 1],
            },
            {
              text: [
                { text: 'AULA: ', bold: true, }, arrAula[1]
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
                widths: [30, 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'N°', bold: true, alignment: 'center' },
                    { text: 'Area', bold: true, alignment: 'center' },
                    { text: 'Subarea', bold: true, alignment: 'center' },
                    { text: 'Docente', bold: true, alignment: 'center' },
                    { text: 'Situación', bold: true, alignment: 'center' },
                  ],
                  ...this.programaciones.map(p => (
                    [
                      this.programaciones.indexOf(p) + 1,
                      p.subarea?.area?.nombre,
                      p.subarea?.nombre,
                      p.docente?.persona?.nombres + ' ' + p.docente?.persona?.apellidopaterno + ' ' + p.docente?.persona?.apellidomaterno,
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


  }

}
