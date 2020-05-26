import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupPlayersPage } from './popup-players.page';

describe('PopupPlayersPage', () => {
  let component: PopupPlayersPage;
  let fixture: ComponentFixture<PopupPlayersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupPlayersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupPlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
