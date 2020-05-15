import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VotingPlayersPage } from './voting-players.page';

describe('VotingPlayersPage', () => {
  let component: VotingPlayersPage;
  let fixture: ComponentFixture<VotingPlayersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingPlayersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingPlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
