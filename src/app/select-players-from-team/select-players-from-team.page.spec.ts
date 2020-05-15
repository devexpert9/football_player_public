import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPlayersFromTeamPage } from './select-players-from-team.page';

describe('SelectPlayersFromTeamPage', () => {
  let component: SelectPlayersFromTeamPage;
  let fixture: ComponentFixture<SelectPlayersFromTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPlayersFromTeamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPlayersFromTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
