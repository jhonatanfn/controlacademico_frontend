import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno.model';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ApoderadoService } from 'src/app/services/apoderado.service';
import { MenuService } from 'src/app/services/menu.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-alumno',
  templateUrl: './editar-alumno.component.html',
  styleUrls: ['./editar-alumno.component.css']
})
export class EditarAlumnoComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Buscar Apoderado';
  public icono2: string = 'bi bi-person';
  public tipos: Tipodocumento[] = [];
  public alumnoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public existeApoderado: boolean = false;
  public mensaje: string = "";
  public apoderadoObj: Apoderado = {};

  public apoderados: Apoderado[] = [];
  selectedApoderado!: any;
  public apoderado_numero: string = "";
  public apoderado_nombres: string = "";
  public apoderado_apellidopaterno: string = "";
  public apoderado_apellidomaterno: string = "";

  constructor(private menuService: MenuService,
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private alumnoService: AlumnoService,
    private apoderadoService: ApoderadoService,
    private route: ActivatedRoute) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });


    this.apoderadoService.todo().subscribe({
      next: ({ ok, apoderados }) => {
        if (ok) {
          this.apoderados = apoderados;
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: error,
          showConfirmButton: false,
          timer: 2500
        })
      }
    })

    this.alumnoService.obtener(Number(Number(this.route.snapshot.paramMap.get('id'))))
      .subscribe(({ ok, alumno }) => {
        if (ok) {
          this.alumnoForm.controls['alumnoId'].setValue(alumno.id);
          this.alumnoForm.controls['personaId'].setValue(alumno.persona?.id);
          this.alumnoForm.controls['tipodocumentoId'].setValue(alumno.persona?.tipodocumento.id);
          this.alumnoForm.controls['numero'].setValue(alumno.persona?.numero);
          this.alumnoForm.controls['nombres'].setValue(alumno.persona?.nombres.toUpperCase());
          this.alumnoForm.controls['apellidopaterno'].setValue(alumno.persona?.apellidopaterno.toUpperCase());
          this.alumnoForm.controls['apellidomaterno'].setValue(alumno.persona?.apellidomaterno.toUpperCase());
          this.alumnoForm.controls['direccion'].setValue(alumno.persona?.direccion?.toUpperCase());
          this.alumnoForm.controls['telefono'].setValue(alumno.persona?.telefono);
          this.alumnoForm.controls['apoderadoId'].setValue(alumno.apoderado?.id);
          this.cargarApoderado();
        }
      });


  }


  ngOnInit(): void {
    this.alumnoForm = this.fb.group({
      alumnoId: [''],
      personaId: [''],
      tipodocumentoId: ['', Validators.required],
      numero: ['', [Validators.required,
      Validators.maxLength(8),
      Validators.minLength(8),
      Validators.pattern(/^\d+$/)]],
      nombres: ['', [Validators.required, Validators.maxLength(20)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(10)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(10)]],
      direccion: [''],
      telefono: [''],
      apoderadoId: ['', Validators.required]
    });
  }

  cargarApoderado(){
    this.apoderados.forEach(apoderado=>{
      if(apoderado.id===this.alumnoForm.get('apoderadoId')?.value){
        this.existeApoderado = true;
        this.apoderado_numero = apoderado.persona?.numero!;
        this.apoderado_nombres = apoderado.persona?.nombres!;
        this.apoderado_apellidopaterno = apoderado.persona?.apellidopaterno!;
        this.apoderado_apellidomaterno = apoderado.persona?.apellidomaterno!;
        return;
      }
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

  apoderadoSeleccionado() {
    if (this.selectedApoderado) {
      this.existeApoderado = true;
      this.apoderado_numero = this.selectedApoderado[1];
      this.apoderado_nombres = this.selectedApoderado[2];
      this.apoderado_apellidopaterno = this.selectedApoderado[3];
      this.apoderado_apellidomaterno = this.selectedApoderado[4];
      this.alumnoForm.controls['apoderadoId'].setValue(this.selectedApoderado[0]);
    } else {
      this.existeApoderado = false;
      this.selectedApoderado = null;
      this.alumnoForm.controls['apoderadoId'].setValue('');
    }
  }

  actualizarAlumno() {

    this.formSubmitted = true;
    if (this.alumnoForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea actualizar el alumno?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.personaService.actualizar(this.alumnoForm.get('personaId')?.value, this.alumnoForm.value)
            .subscribe(({ ok, persona }) => {
              if (ok) {
                let alumnoObj = new Alumno(persona.id, this.alumnoForm.get('apoderadoId')?.value);
                this.alumnoService.actualizar(this.alumnoForm.get('alumnoId')?.value, alumnoObj)
                .subscribe({
                  next: ({ok,msg})=>{
                    if(ok){
                      this.alumnoForm.controls['nombres'].setValue(persona?.nombres.toUpperCase());
                      this.alumnoForm.controls['apellidopaterno'].setValue(persona?.apellidopaterno.toUpperCase());
                      this.alumnoForm.controls['apellidomaterno'].setValue(persona?.apellidomaterno.toUpperCase());
                      this.alumnoForm.controls['direccion'].setValue(persona?.direccion?.toUpperCase());
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: false,
                        timer: 1500
                      })
                    }
                  },
                  error: (error)=>{
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: "Se produjo un error. Hable con el administrador",
                      showConfirmButton: false,
                      timer: 1500
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
