import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChoosePlayersForTeamPage } from './choose-players-for-team.page';

describe('ChoosePlayersForTeamPage', () => {
  let component: ChoosePlayersForTeamPage;
  let fixture: ComponentFixture<ChoosePlayersForTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePlayersForTeamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChoosePlayersForTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
