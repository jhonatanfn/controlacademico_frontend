import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { InstitucionGuard } from '../guards/institucion.guard';

const routes:Routes=[
  { 
    path:'login',
    component:LoginComponent,
    canActivate:[InstitucionGuard],
    canLoad:[InstitucionGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports:[
    RouterModule
  ]
})
export class AuthRoutingModule { }
