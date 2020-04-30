import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderPage } from '../header/header.page';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule
  ],
  declarations: [HeaderPage],
  exports: [HeaderPage]
})

export class SharedModule { }
 