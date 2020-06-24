import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderPage } from '../header/header.page';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TimeAgoPipe} from 'time-ago-pipe';
@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule,
 
  ],
  declarations: [HeaderPage, TimeAgoPipe],
  exports: [HeaderPage,TimeAgoPipe]
})

export class SharedModule { }
 