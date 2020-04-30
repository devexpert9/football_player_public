import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from "../shared/shared.module";
import { TeamInvitationsPageRoutingModule } from './team-invitations-routing.module';

import { TeamInvitationsPage } from './team-invitations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamInvitationsPageRoutingModule,
    SharedModule
  ],
  declarations: [TeamInvitationsPage]
})
export class TeamInvitationsPageModule {}
