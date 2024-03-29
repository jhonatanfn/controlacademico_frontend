import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { MadreService } from 'src/app/services/madre.service';
import { PadreService } from 'src/app/services/padre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ResponsableService } from 'src/app/services/responsable.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-alumno',
  templateUrl: './crear-alumno.component.html',
  styleUrls: ['./crear-alumno.component.css']
})
export class CrearAlumnoComponent implements OnInit {

  public titulo: string = 'Datos Generales del Alumno';
  public icono: string = 'bi bi-plus-square';
  public titulo4: string = 'Datos Especificos del Alumno';
  public icono4: string = 'bi bi-plus-square';
  public titulo2: string = 'Datos del Padre';
  public icono2: string = 'bi bi-plus-square';
  public titulo3: string = 'Datos de la Madre';
  public icono3: string = 'bi bi-plus-square';
  public titulo5: string = 'Datos del Responsable de la Inscripción';
  public icono5: string = 'bi bi-plus-square';

  public tipos: Tipodocumento[] = [];
  public alumnoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public mensaje: string = "";

  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;

  public vives: any[] = [
    { id: 1, nombre: "Padre" },
    { id: 2, nombre: "Madre" },
    { id: 3, nombre: "Ambos Padres" },
    { id: 4, nombre: "Abuelos" },
  ];
  public tienedis: any[] = [
    { id: 1, nombre: "NO" },
    { id: 2, nombre: "SI" },
  ];
  public tienecert: any[] = [
    { id: 1, nombre: "NO" },
    { id: 2, nombre: "SI" },
  ];

  public activopadre: boolean = true;
  public activomadre: boolean = true;
  public activoresponsable: boolean = true;

  constructor(
    private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private alumnoService: AlumnoService, private router: Router,
    private padreService: PadreService, private madreService: MadreService,
    private responsableService: ResponsableService) {

    this.tipodocumentoService.listar()
      .subscribe({
        next: ({ tipodocumentos }) => {
          this.tipos = tipodocumentos;
          this.alumnoForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
          this.alumnoForm.controls['padretipodocumentoId'].setValue(this.tipos[0].id);
          this.alumnoForm.controls['madretipodocumentoId'].setValue(this.tipos[0].id);
          this.alumnoForm.controls['responsabletipodocumentoId'].setValue(this.tipos[0].id);
        }
      });
  }

  ngOnInit(): void {
    this.alumnoForm = this.fb.group({
      dni: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)
      ]],
      nombres: ['', [Validators.required, Validators.maxLength(60)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(30)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(30)]],
      sexo: ['', Validators.required],
      tipodocumentoId: ['', Validators.required],
      fechanacimiento: ['', Validators.required],
      padreId: [''],
      madreId: [''],
      domicilio: [''],
      telefono: [''],
      nacionalidad: [''],
      distrito: [''],
      correo: [''],
      vivecon: ['', Validators.required],
      tienediscapacidad: ['', Validators.required],
      certificadiscapacidad: ['', Validators.required],
      cualdiscapacidad: [''],
      observacion: [''],
      inicialprocede: [''],
      colegioprocede: [''],
      responsableId: [''],
      id: [''],

      padredni: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)
      ]],
      padrenombres: ['', [Validators.required, Validators.maxLength(60)]],
      padreapellidopaterno: ['', [Validators.required, Validators.maxLength(30)]],
      padreapellidomaterno: ['', [Validators.required, Validators.maxLength(30)]],
      padresexo: [1],
      padrefechanacimiento: ['', Validators.required],
      padrevive: ['', Validators.required],
      padretipodocumentoId: ['', Validators.required],

      madredni: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)
      ]],
      madrenombres: ['', [Validators.required, Validators.maxLength(60)]],
      madreapellidopaterno: ['', [Validators.required, Validators.maxLength(30)]],
      madreapellidomaterno: ['', [Validators.required, Validators.maxLength(30)]],
      madresexo: [2],
      madrefechanacimiento: ['', Validators.required],
      madrevive: ['', Validators.required],
      madretipodocumentoId: ['', Validators.required],

      responsabledni: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)
      ]],
      responsablenombres: ['', [Validators.required, Validators.maxLength(60)]],
      responsableapellidopaterno: ['', [Validators.required, Validators.maxLength(30)]],
      responsableapellidomaterno: ['', [Validators.required, Validators.maxLength(30)]],
      responsablesexo: ['', Validators.required],
      responsablefechanacimiento: ['', Validators.required],
      responsabletipodocumentoId: ['', Validators.required],

    });
  }

  campoRequerido(campo: string) {
    if (this.alumnoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.alumnoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.alumnoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.alumnoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.alumnoForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.alumnoForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if (this.alumnoForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  validaDNI() {
    if ((this.alumnoForm.get('dni')?.value).length == 8
      && !this.alumnoForm.get('dni')?.getError('required')
      && !this.alumnoForm.get('dni')?.getError('pattern')) {
      this.alumnoService.searchDNI(this.alumnoForm.get('dni')?.value).subscribe({
        next: ({ ok }) => {
          if (ok) {
            this.alumnoForm.controls['dni'].setErrors({ error: true });
            this.dnirepetido = true;
          } else {
            this.alumnoForm.controls['dni'].setErrors(null);
            this.dnirepetido = false;
          }
        }
      });
    } else {
      this.dnirepetido = false;
    }
  }
  validarPadre() {
    if ((this.alumnoForm.get('padredni')?.value).length == 8
      && !this.alumnoForm.get('padredni')?.getError('required')
      && !this.alumnoForm.get('padredni')?.getError('pattern')) {
      this.padreService.consultadniPadre((this.alumnoForm.get('padredni')?.value).trim()).subscribe({
        next: ({ ok, padre }) => {
          if (ok) {
            if (padre) {
              this.alumnoForm.controls['padrenombres'].setValue(padre.persona?.nombres);
              this.alumnoForm.controls['padreapellidopaterno'].setValue(padre.persona?.apellidopaterno);
              this.alumnoForm.controls['padreapellidomaterno'].setValue(padre.persona?.apellidomaterno);
              this.alumnoForm.controls['padrefechanacimiento'].setValue(padre.persona?.fechanacimiento);
              this.alumnoForm.controls['padreId'].setValue(padre.id);
              if (padre.vive) {
                this.alumnoForm.controls['padrevive'].setValue("SI");
              } else {
                this.alumnoForm.controls['padrevive'].setValue("NO");
              }
              this.activopadre = true;
            } else {
              this.alumnoForm.controls['padrenombres'].setValue("");
              this.alumnoForm.controls['padreapellidopaterno'].setValue("");
              this.alumnoForm.controls['padreapellidomaterno'].setValue("");
              this.alumnoForm.controls['padrefechanacimiento'].setValue("");
              this.alumnoForm.controls['padreId'].setValue("");
              this.alumnoForm.controls['padrevive'].setValue("");
              this.activopadre = false;
            }
          }
        }
      });
    }
  }
  validarMadre() {
    if ((this.alumnoForm.get('madredni')?.value).length == 8
      && !this.alumnoForm.get('madredni')?.getError('required')
      && !this.alumnoForm.get('madredni')?.getError('pattern')) {
      this.madreService.consultadniMadre((this.alumnoForm.get('madredni')?.value).trim()).subscribe({
        next: ({ ok, madre }) => {
          if (ok) {
            if (madre) {
              this.alumnoForm.controls['madrenombres'].setValue(madre.persona?.nombres);
              this.alumnoForm.controls['madreapellidopaterno'].setValue(madre.persona?.apellidopaterno);
              this.alumnoForm.controls['madreapellidomaterno'].setValue(madre.persona?.apellidomaterno);
              this.alumnoForm.controls['madrefechanacimiento'].setValue(madre.persona?.fechanacimiento);
              this.alumnoForm.controls['madreId'].setValue(madre.id);
              if (madre.vive) {
                this.alumnoForm.controls['madrevive'].setValue("SI");
              } else {
                this.alumnoForm.controls['madrevive'].setValue("NO");
              }
              this.activomadre = true;
            } else {
              this.alumnoForm.controls['madrenombres'].setValue("");
              this.alumnoForm.controls['madreapellidopaterno'].setValue("");
              this.alumnoForm.controls['madreapellidomaterno'].setValue("");
              this.alumnoForm.controls['madrefechanacimiento'].setValue("");
              this.alumnoForm.controls['madreId'].setValue("");
              this.alumnoForm.controls['madrevive'].setValue("");
              this.activomadre = false;
            }
          }
        }
      });
    }
  }

  validarResponsable() {
    if ((this.alumnoForm.get('responsabledni')?.value).length == 8
      && !this.alumnoForm.get('responsabledni')?.getError('required')
      && !this.alumnoForm.get('responsabledni')?.getError('pattern')) {
      this.responsableService.consultadniResponsable((this.alumnoForm.get('responsabledni')?.value).trim()).subscribe({
        next: ({ ok, responsable }) => {
          if (ok) {
            if (responsable) {
              this.alumnoForm.controls['responsablenombres'].setValue(responsable.persona?.nombres);
              this.alumnoForm.controls['responsableapellidopaterno'].setValue(responsable.persona?.apellidopaterno);
              this.alumnoForm.controls['responsableapellidomaterno'].setValue(responsable.persona?.apellidomaterno);
              this.alumnoForm.controls['responsablefechanacimiento'].setValue(responsable.persona?.fechanacimiento);
              this.alumnoForm.controls['responsableId'].setValue(responsable.id);
              this.alumnoForm.controls['responsablesexo'].setValue(responsable.persona?.sexo);
              this.activoresponsable = true;
            } else {
              this.alumnoForm.controls['responsablenombres'].setValue("");
              this.alumnoForm.controls['responsableapellidopaterno'].setValue("");
              this.alumnoForm.controls['responsableapellidomaterno'].setValue("");
              this.alumnoForm.controls['responsablefechanacimiento'].setValue("");
              this.alumnoForm.controls['responsableId'].setValue("");
              this.activoresponsable = false;
            }
          }
        }
      });
    }
  }

  guardarAlumno() {
    this.formSubmitted = true;

    if (this.alumnoForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el alumno?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.crear(this.alumnoForm.value)
            .subscribe(({ ok, persona }) => {
              if (ok) {
                this.alumnoForm.controls['id'].setValue(persona.id);
                this.personaService.existePersona((this.alumnoForm.get('responsabledni')?.value).trim())
                  .subscribe({
                    next: ({ ok, persona }) => {
                      if (ok) {
                        if (persona) {
                          let pv = false;
                          let pm = false;
                          if (this.alumnoForm.get('padrevive')?.value == "SI") {
                            pv = true;
                          }
                          if (this.alumnoForm.get('madrevive')?.value == "SI") {
                            pm = true;
                          }
                          let responsableObj: any = {
                            personaId: persona.id,
                            dniusuario: this.alumnoForm.get('responsabledni')?.value,
                            nombreusuario: (this.alumnoForm.get('responsablenombres')?.value).trim().toLowerCase(),
                            padrevive: pv,
                            medrevive: pm
                          };
                          this.responsableService.crear(responsableObj).subscribe({
                            next: ({ ok, responsable }) => {
                              if (ok) {
                                this.alumnoForm.controls['responsableId'].setValue(responsable.id);

                                let alumnoObj: any = {
                                  personaId: this.alumnoForm.get('id')?.value,
                                  nombreusuario: (this.alumnoForm.get('nombres')?.value).trim().toLowerCase(),
                                  dniusuario: (this.alumnoForm.get('dni')?.value),
                                  padreId: this.alumnoForm.get('padreId')?.value,
                                  madreId: this.alumnoForm.get('madreId')?.value,
                                  responsableId: this.alumnoForm.get('responsableId')?.value,
                                  vivecon: this.alumnoForm.get('vivecon')?.value,
                                  tienediscapacidad: this.alumnoForm.get('tienediscapacidad')?.value,
                                  certificadiscapacidad: this.alumnoForm.get('certificadiscapacidad')?.value,
                                  cualdiscapacidad: this.alumnoForm.get('cualdiscapacidad')?.value,
                                  observacion: this.alumnoForm.get('observacion')?.value,
                                  inicialprocede: this.alumnoForm.get('inicialprocede')?.value,
                                  colegioprocede: this.alumnoForm.get('colegioprocede')?.value,

                                  padredni: this.alumnoForm.get('padredni')?.value,
                                  padredniusuario: (this.alumnoForm.get('padredni')?.value).trim(),
                                  padrenombreusuario: (this.alumnoForm.get('padrenombres')?.value).trim().toLowerCase(),
                                  padrenombres: this.alumnoForm.get('padrenombres')?.value,
                                  padreapellidopaterno: this.alumnoForm.get('padreapellidopaterno')?.value,
                                  padreapellidomaterno: this.alumnoForm.get('padreapellidomaterno')?.value,
                                  padresexo: this.alumnoForm.get('padresexo')?.value,
                                  padrefechanacimiento: this.alumnoForm.get('padrefechanacimiento')?.value,
                                  padrevive: pv,
                                  padretipodocumentoId: this.alumnoForm.get('padretipodocumentoId')?.value,

                                  madredni: this.alumnoForm.get('madredni')?.value,
                                  madredniusuario: (this.alumnoForm.get('madredni')?.value).trim(),
                                  madrenombreusuario: (this.alumnoForm.get('madrenombres')?.value).trim().toLowerCase(),
                                  madrenombres: this.alumnoForm.get('madrenombres')?.value,
                                  madreapellidopaterno: this.alumnoForm.get('madreapellidopaterno')?.value,
                                  madreapellidomaterno: this.alumnoForm.get('madreapellidomaterno')?.value,
                                  madresexo: this.alumnoForm.get('madresexo')?.value,
                                  madrefechanacimiento: this.alumnoForm.get('madrefechanacimiento')?.value,
                                  madrevive: pm,
                                  madretipodocumentoId: this.alumnoForm.get('madretipodocumentoId')?.value,

                                };

                                this.alumnoService.crear(alumnoObj)
                                  .subscribe({
                                    next: ({ ok, msg }) => {
                                      if (ok) {
                                        this.router.navigateByUrl('dashboard/alumnos');
                                        Swal.fire({
                                          position: 'top-end',
                                          icon: 'success',
                                          title: msg,
                                          showConfirmButton: false,
                                          timer: 1000
                                        });
                                      }
                                    },
                                    error: (error) => {
                                      Swal.fire({
                                        position: 'top-end',
                                        icon: 'error',
                                        title: error.error.msg,
                                        showConfirmButton: false,
                                        timer: 1000
                                      })
                                    }
                                  });
                              }
                            }
                          });
                        } else {

                          let personar: any = {
                            dni: this.alumnoForm.get('responsabledni')?.value,
                            nombres: this.alumnoForm.get('responsablenombres')?.value,
                            apellidopaterno: this.alumnoForm.get('responsableapellidopaterno')?.value,
                            apellidomaterno: this.alumnoForm.get('responsableapellidomaterno')?.value,
                            sexo: this.alumnoForm.get('responsablesexo')?.value,
                            fechanacimiento: this.alumnoForm.get('responsablefechanacimiento')?.value,
                            tipodocumentoId: this.alumnoForm.get('responsabletipodocumentoId')?.value,
                          };
                          this.personaService.crear(personar).subscribe({
                            next: ({ ok, persona }) => {
                              if (ok) {
                                let pv = false;
                                let pm = false;
                                if (this.alumnoForm.get('padrevive')?.value == "SI") {
                                  pv = true;
                                }
                                if (this.alumnoForm.get('madrevive')?.value == "SI") {
                                  pm = true;
                                }
                                let responsableObj: any = {
                                  personaId: persona.id,
                                  dniusuario: this.alumnoForm.get('responsabledni')?.value,
                                  nombreusuario: (this.alumnoForm.get('responsablenombres')?.value).trim().toLowerCase(),
                                  padrevive: pv,
                                  medrevive: pm
                                };
                                this.responsableService.crear(responsableObj).subscribe({
                                  next: ({ ok, responsable }) => {
                                    if (ok) {
                                      this.alumnoForm.controls['responsableId'].setValue(responsable.id);

                                      let alumnoObj: any = {
                                        personaId: this.alumnoForm.get('id')?.value,
                                        nombreusuario: (this.alumnoForm.get('nombres')?.value).trim().toLowerCase(),
                                        dniusuario: (this.alumnoForm.get('dni')?.value),
                                        padreId: this.alumnoForm.get('padreId')?.value,
                                        madreId: this.alumnoForm.get('madreId')?.value,
                                        responsableId: this.alumnoForm.get('responsableId')?.value,
                                        vivecon: this.alumnoForm.get('vivecon')?.value,
                                        tienediscapacidad: this.alumnoForm.get('tienediscapacidad')?.value,
                                        certificadiscapacidad: this.alumnoForm.get('certificadiscapacidad')?.value,
                                        cualdiscapacidad: this.alumnoForm.get('cualdiscapacidad')?.value,
                                        observacion: this.alumnoForm.get('observacion')?.value,
                                        inicialprocede: this.alumnoForm.get('inicialprocede')?.value,
                                        colegioprocede: this.alumnoForm.get('colegioprocede')?.value,

                                        padredni: this.alumnoForm.get('padredni')?.value,
                                        padredniusuario: (this.alumnoForm.get('padredni')?.value).trim(),
                                        padrenombreusuario: (this.alumnoForm.get('padrenombres')?.value).trim().toLowerCase(),
                                        padrenombres: this.alumnoForm.get('padrenombres')?.value,
                                        padreapellidopaterno: this.alumnoForm.get('padreapellidopaterno')?.value,
                                        padreapellidomaterno: this.alumnoForm.get('padreapellidomaterno')?.value,
                                        padresexo: this.alumnoForm.get('padresexo')?.value,
                                        padrefechanacimiento: this.alumnoForm.get('padrefechanacimiento')?.value,
                                        padrevive: pv,
                                        padretipodocumentoId: this.alumnoForm.get('padretipodocumentoId')?.value,

                                        madredni: this.alumnoForm.get('madredni')?.value,
                                        madredniusuario: (this.alumnoForm.get('madredni')?.value).trim(),
                                        madrenombreusuario: (this.alumnoForm.get('madrenombres')?.value).trim().toLowerCase(),
                                        madrenombres: this.alumnoForm.get('madrenombres')?.value,
                                        madreapellidopaterno: this.alumnoForm.get('madreapellidopaterno')?.value,
                                        madreapellidomaterno: this.alumnoForm.get('madreapellidomaterno')?.value,
                                        madresexo: this.alumnoForm.get('madresexo')?.value,
                                        madrefechanacimiento: this.alumnoForm.get('madrefechanacimiento')?.value,
                                        madrevive: pm,
                                        madretipodocumentoId: this.alumnoForm.get('madretipodocumentoId')?.value,

                                      };

                                      this.alumnoService.crear(alumnoObj)
                                        .subscribe({
                                          next: ({ ok, msg }) => {
                                            if (ok) {
                                              this.router.navigateByUrl('dashboard/alumnos');
                                              Swal.fire({
                                                position: 'top-end',
                                                icon: 'success',
                                                title: msg,
                                                showConfirmButton: false,
                                                timer: 1000
                                              });
                                            }
                                          },
                                          error: (error) => {
                                            Swal.fire({
                                              position: 'top-end',
                                              icon: 'error',
                                              title: error.error.msg,
                                              showConfirmButton: false,
                                              timer: 1000
                                            })
                                          }
                                        });
                                    }
                                  }
                                });
                              }
                            }
                          });
                        }
                      }
                    }
                  });
              }
            });
        }
      });
    }
  }
}
