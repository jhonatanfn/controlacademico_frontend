import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css']
})
export class InstitucionComponent implements OnInit {

  public titulo2: string = 'Imagen de la Institución';
  public icono2: string = 'bi bi-image';
  public titulo4: string = 'Datos de la Institución';
  public icono4: string = 'bi bi-house-door-fill';
  public institucion: Institucion = {
    nombre: "", direccion: "", telefono: "", email: "", img: ""
  };
  public imagenSubir!: File;
  public imgTemp: any = null;
  public datosForm!: FormGroup;
  public formSubmitted: boolean = false;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public cargando: boolean = false;

  constructor(private fb: FormBuilder, private institucionService: InstitucionService) {
  }

  ngOnInit(): void {
    this.institucion = this.institucionService.institucion;
    this.datosForm = this.fb.group({
      nombre: [this.institucion.nombre, [Validators.required, Validators.maxLength(100)]],
      direccion: [this.institucion.direccion, [Validators.required, Validators.maxLength(100)]],
      telefono: [this.institucion.telefono, [Validators.required, Validators.maxLength(15)]],
      email: [this.institucion.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      id: [this.institucion.id]
    });
  }
  campoRequerido(campo: string) {
    if (this.datosForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, lon: number) {
    if (this.datosForm.get(campo)?.value === "") {
      return;
    }
    if ((this.datosForm.get(campo)?.getError('maxlength')?.requiredLength == lon) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoEmail(campo: string) {
    if (this.datosForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  cambiarImagen(event: any) {
    this.imagenSubir = event.target.files[0];
    if (!event.target.files[0]) {
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
    return true;
  }

  subirImagen() {
    Swal.fire({
      title: 'Actualizar',
      text: "Desea actualizar el logo de la institución",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando = true;
        this.institucionService.actualizarLogo(this.imagenSubir, this.datosForm.get('id')?.value)
          .then(img => {
            this.institucion.img = img;
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'El logo de la institución fue actualizado',
              showConfirmButton: false,
              timer: 2500
            });
            this.cargando = false;
          });
      }
    })
  }

  actualizarDatos() {
    this.formSubmitted = true;

    if (this.datosForm.valid) {

      Swal.fire({
        title: 'Actualizar',
        text: "Desea actualizar los datos de la institución",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          this.institucionService.actualizar(this.datosForm.get('id')?.value, this.datosForm.value)
            .subscribe({
              next: ({ ok, msg, institucion }) => {
                if (ok) {
                  this.institucion.nombre = institucion.nombre;

                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1000
                  })
                }
              },
              error: (error) => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: error.msg,
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            })
        }
      })

    }
  }

}
