import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamInvitationsPage } from './team-invitations.page';

describe('TeamInvitationsPage', () => {
  let component: TeamInvitationsPage;
  let fixture: ComponentFixture<TeamInvitationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInvitationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamInvitationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
