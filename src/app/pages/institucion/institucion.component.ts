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

  public titulo2: string = 'Logo de la Institución';
  public icono2: string = 'bi bi-image';
  public titulo4: string = 'Actualizar Información';
  public icono4: string = 'bi bi-pen';
  public titulo5: string = 'Información General';
  public icono5: string = 'bi bi-card-heading';
  public institucion: Institucion = {
    nombre: "", direccion: "", telefono: "", email: "", img: "",
    departamento: "", provincia: "", distrito: "", centropoblado: "",
    dre: "", ugel: "", tipogestion: "", generoalumno: "", formaatencion: "",
    turnoatencion: "", paginaweb: ""
  };
  public imagenSubir!: File;
  public imgTemp: any = null;
  public datosForm!: FormGroup;
  public formSubmitted: boolean = false;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public cargando: boolean = false;

  public cambiar: boolean = false;
  public actualizar: boolean = false;
  public general: boolean = true;
  public activologo: string = "";
  public activoactualizar: string = "";
  public activogeneral: string = "active";

  constructor(private fb: FormBuilder, private institucionService: InstitucionService) {
  }

  ngOnInit(): void {
    this.institucion = this.institucionService.institucion;
    this.datosForm = this.fb.group({
      nombre: [this.institucion.nombre, [Validators.required, Validators.maxLength(100)]],
      direccion: [this.institucion.direccion, [Validators.required, Validators.maxLength(100)]],
      telefono: [this.institucion.telefono, [Validators.required, Validators.maxLength(15)]],
      email: [this.institucion.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      departamento: [this.institucion.departamento],
      provincia: [this.institucion.provincia],
      distrito: [this.institucion.distrito],
      centropoblado: [this.institucion.centropoblado],
      dre: [this.institucion.dre],
      ugel: [this.institucion.ugel],
      tipogestion: [this.institucion.tipogestion],
      generoalumno: [this.institucion.generoalumno],
      formaatencion: [this.institucion.formaatencion],
      turnoatencion: [this.institucion.turnoatencion],
      paginaweb: [this.institucion.paginaweb],
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


  verificarOpcion(termino: string) {
    if (termino == "cambiar") {
      this.cambiar = true;
      this.actualizar = false;
      this.general = false;
      this.activologo = "active";
      this.activoactualizar = "";
      this.activogeneral = "";
    }
    if (termino == "actualizar") {
      this.cambiar = false;
      this.actualizar = true;
      this.general = false;
      this.activologo = "";
      this.activoactualizar = "active";
      this.activogeneral = "";
    }
    if (termino == "general") {
      this.cambiar = false;
      this.actualizar = false;
      this.general = true;
      this.activologo = "";
      this.activoactualizar = "";
      this.activogeneral = "active";
    }
  }


  cambiarImagen(event: any) {
    const extencionesValidas=['png','jpg','jpeg','gif','JPG','JPEG','PNG'];
    if(extencionesValidas.includes(this.getFileExtension(event.target.files[0].name))){    
      this.imagenSubir = event.target.files[0];
      if (!event.target.files[0]) {
        return this.imgTemp = null;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        this.imgTemp = reader.result;
      }
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "La extensión  no es válida",
        showConfirmButton: false,
        timer: 1000
      });
    }

    return true;
  }
  getFileExtension(filename:any) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
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
              timer: 1000
            });
            this.cargando = false;
          }).catch(error => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error.error.msg,
              showConfirmButton: false,
              timer: 1000
            });
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
                  this.institucion.direccion = institucion.direccion;
                  this.institucion.telefono = institucion.telefono;
                  this.institucion.email = institucion.email;
                  this.institucion.departamento = institucion.departamento;
                  this.institucion.provincia = institucion.provincia;
                  this.institucion.distrito = institucion.distrito;
                  this.institucion.centropoblado = institucion.centropoblado;
                  this.institucion.dre = institucion.dre;
                  this.institucion.ugel = institucion.ugel;
                  this.institucion.tipogestion = institucion.tipogestion;
                  this.institucion.generoalumno = institucion.generoalumno;
                  this.institucion.formaatencion = institucion.formaatencion;
                  this.institucion.turnoatencion = institucion.turnoatencion;
                  this.institucion.paginaweb = institucion.paginaweb;
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
            });
        }
      })
    }
  }

}
