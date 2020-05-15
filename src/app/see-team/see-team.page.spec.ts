import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeeTeamPage } from './see-team.page';

describe('SeeTeamPage', () => {
  let component: SeeTeamPage;
  let fixture: ComponentFixture<SeeTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeTeamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeeTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
