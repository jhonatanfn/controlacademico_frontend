import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { ApoderadoService } from 'src/app/services/apoderado.service';
import { MenuService } from 'src/app/services/menu.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-apoderado',
  templateUrl: './editar-apoderado.component.html',
  styleUrls: ['./editar-apoderado.component.css']
})
export class EditarApoderadoComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public tipos: Tipodocumento[] = [];
  public apoderadoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public apoderado!: Apoderado;

  constructor(private menuService: MenuService,
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
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

    this.apoderadoService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, apoderado }) => {
        if (ok) {
          this.apoderadoForm.controls['tipodocumentoId'].setValue(apoderado.persona?.tipodocumento.id);
          this.apoderadoForm.controls['numero'].setValue(apoderado.persona?.numero);
          this.apoderadoForm.controls['nombres'].setValue(apoderado.persona?.nombres.toUpperCase());
          this.apoderadoForm.controls['apellidopaterno'].setValue(apoderado.persona?.apellidopaterno.toUpperCase());
          this.apoderadoForm.controls['apellidomaterno'].setValue(apoderado.persona?.apellidomaterno.toUpperCase());
          this.apoderadoForm.controls['direccion'].setValue(apoderado.persona?.direccion?.toUpperCase());
          this.apoderadoForm.controls['telefono'].setValue(apoderado.persona?.telefono);
          this.apoderadoForm.controls['id'].setValue(apoderado.persona?.id);
        }

      });

  }

  ngOnInit(): void {
    this.apoderadoForm = this.fb.group({
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
      id: ['']
    });

  }

  campoRequerido(campo: string) {
    if (this.apoderadoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.apoderadoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.apoderadoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoMinLength(campo: string, longitud: number) {
    if (this.apoderadoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.apoderadoForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if(this.apoderadoForm.controls[campo].getError('pattern') && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }


  actualizarApoderado() {

    this.formSubmitted = true;

    if (this.apoderadoForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar el apoderado?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.personaService.actualizar(this.apoderadoForm.get('id')?.value, this.apoderadoForm.value)
            .subscribe(({ ok, msg, persona }) => {
              if (ok) {
                this.apoderadoForm.controls['nombres'].setValue(persona?.nombres.toUpperCase());
                this.apoderadoForm.controls['apellidopaterno'].setValue(persona?.apellidopaterno.toUpperCase());
                this.apoderadoForm.controls['apellidomaterno'].setValue(persona?.apellidomaterno.toUpperCase());
                this.apoderadoForm.controls['direccion'].setValue(persona?.direccion?.toUpperCase());
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Apoderado actualizado exitosamente.',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            });
        }
      })
    }

  }

}
