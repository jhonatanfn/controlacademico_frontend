import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Madre } from 'src/app/models/madre.model';
import { Padre } from 'src/app/models/padre.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { MadreService } from 'src/app/services/madre.service';
import { PadreService } from 'src/app/services/padre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-alumno',
  templateUrl: './crear-alumno.component.html',
  styleUrls: ['./crear-alumno.component.css']
})
export class CrearAlumnoComponent implements OnInit {

  public titulo: string = 'Datos Generales';
  public icono: string = 'bi bi-plus-square';
  public titulo4: string = 'Datos Especificos';
  public icono4: string = 'bi bi-plus-square';
  public titulo2: string = 'Buscar Padre';
  public icono2: string = 'bi bi-search';
  public titulo3: string = 'Buscar Madre';
  public icono3: string = 'bi bi-search';

  public tipos: Tipodocumento[] = [];
  public alumnoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public mensaje: string = "";

  public padres: Padre[] = [];
  selectedPadre!: any;
  public padre_dni: string = "";
  public padre_nombres: string = "";
  public padre_apellidopaterno: string = "";
  public padre_apellidomaterno: string = "";
  public padre_img: string = "";

  public madres: Madre[] = [];
  selectedMadre!: any;
  public madre_dni: string = "";
  public madre_nombres: string = "";
  public madre_apellidopaterno: string = "";
  public madre_apellidomaterno: string = "";
  public madre_img: string = "";

  public existePadre: boolean = false;
  public existeMadre: boolean = false;
  public repetido: boolean = false;
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

  public tienedis:any[]=[
    { id: 1, nombre: "NO" },
    { id: 2, nombre: "SI" },
  ];

  public tienecert:any[]=[
    { id: 1, nombre: "NO" },
    { id: 2, nombre: "SI" },
  ];


  constructor(
    private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private alumnoService: AlumnoService, private router: Router,
    private padreService: PadreService, private madreService: MadreService) {

    this.tipodocumentoService.listar()
      .subscribe({
        next: ({ tipodocumentos }) => {
          this.tipos = tipodocumentos;
          this.alumnoForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
        }
      });

    this.padreService.todo().subscribe({
      next: ({ ok, padres }) => {
        if (ok) {
          this.padres = padres;
        }
      }
    });
    this.madreService.todo().subscribe({
      next: ({ ok, madres }) => {
        if (ok) {
          this.madres = madres;
        }
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
      nombres: ['', [Validators.required, Validators.maxLength(20)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(10)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(10)]],
      sexo: ['', Validators.required],
      tipodocumentoId: ['', Validators.required],
      fechanacimiento: ['', Validators.required],
      padreId: ['', Validators.required],
      madreId: ['', Validators.required],
      domicilio: [''],
      telefono: [''],
      nacionalidad: [''],
      distrito: [''],
      correo: [''],
      vivecon: ['', Validators.required],
      tienediscapacidad: ['', Validators.required],
      certificadiscapacidad: ['', Validators.required],
      cualdiscapacidad: [''],
      observacion: ['']
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

  padreSeleccionado() {
    if (this.selectedPadre) {
      this.existePadre = true;
      this.padre_dni = this.selectedPadre[1];
      this.padre_nombres = this.selectedPadre[2];
      this.padre_apellidopaterno = this.selectedPadre[3];
      this.padre_apellidomaterno = this.selectedPadre[4];
      this.padre_img = this.selectedPadre[5];
      this.alumnoForm.controls['padreId'].setValue(this.selectedPadre[0]);
    } else {
      this.existePadre = false;
      this.selectedPadre = null;
      this.alumnoForm.controls['padreId'].setValue('');
    }
  }

  madreSeleccionado() {
    if (this.selectedMadre) {
      this.existeMadre = true;
      this.madre_dni = this.selectedMadre[1];
      this.madre_nombres = this.selectedMadre[2];
      this.madre_apellidopaterno = this.selectedMadre[3];
      this.madre_apellidomaterno = this.selectedMadre[4];
      this.madre_img = this.selectedMadre[5];
      this.alumnoForm.controls['madreId'].setValue(this.selectedMadre[0]);
    } else {
      this.existeMadre = false;
      this.selectedMadre = null;
      this.alumnoForm.controls['madreId'].setValue('');
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
                let alumnoObj: any = {
                  personaId: persona.id,
                  nombreusuario: (this.alumnoForm.get('nombres')?.value).toLowerCase(),
                  padreId: this.alumnoForm.get('padreId')?.value,
                  madreId: this.alumnoForm.get('madreId')?.value,
                  vivecon: this.alumnoForm.get('vivecon')?.value,
                  tienediscapacidad: this.alumnoForm.get('tienediscapacidad')?.value,
                  certificadiscapacidad: this.alumnoForm.get('certificadiscapacidad')?.value,
                  cualdiscapacidad: this.alumnoForm.get('cualdiscapacidad')?.value,
                  observacion: this.alumnoForm.get('observacion')?.value
                }
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
                  })
              }
            });
        }
      })
    }
  }
}
