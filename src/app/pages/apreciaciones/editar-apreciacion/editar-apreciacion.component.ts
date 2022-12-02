import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApreciaciondetalleService } from 'src/app/services/apreciaciondetalle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-apreciacion',
  templateUrl: './editar-apreciacion.component.html',
  styleUrls: ['./editar-apreciacion.component.css']
})
export class EditarApreciacionComponent implements OnInit {

  public apreciaciondetalles: any[] = [];
  public datoAlumno = {
    periodo: "",
    alumno: ""
  };
  public titulo: string = 'Datos alumno';
  public icono: string = 'bi bi-mortarboard';
  public titulo2: string = 'Apreciaciones';
  public icono2: string = 'bi bi-chat-text';
  public escalas: any[] = [
    { id: 1, nombre: "AD" },
    { id: 2, nombre: "A" },
    { id: 3, nombre: "B" },
    { id: 4, nombre: "C" },
    { id: 5, nombre: "-" },
  ];


  constructor(private route: ActivatedRoute,
    private apreciaciondetalleService: ApreciaciondetalleService) {

    this.apreciaciondetalleService.apreciaciondetallesApreciacion(
      Number(this.route.snapshot.paramMap.get('id'))
    ).subscribe({
      next: ({ ok, apreciaciondetalles }) => {
        if (ok) {
          this.apreciaciondetalles = apreciaciondetalles;
          this.datoAlumno = {
            periodo: this.apreciaciondetalles[0].apreciacion?.periodo?.nombre,
            alumno: (this.apreciaciondetalles[0].apreciacion?.alumno?.persona?.nombres + ' ' +
              this.apreciaciondetalles[0].apreciacion?.alumno?.persona?.apellidopaterno + ' ' +
              this.apreciaciondetalles[0].apreciacion?.alumno?.persona?.apellidomaterno)
          };
        }
      }
    })

  }

  ngOnInit(): void {
  }

  actualizarApreciacion() {
    Swal.fire({
      title: 'Actualizar',
      text: "¿Desea actualizar la apreciacion?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apreciaciondetalles.forEach(apreciaciondetalle => {
          this.apreciaciondetalleService.actualizar(apreciaciondetalle.id, apreciaciondetalle)
            .subscribe({
              next: ({ ok, msg }) => { }
            });
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Apreciacion actualizada con exito.",
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }

}
