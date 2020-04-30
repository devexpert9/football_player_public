import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerRequestsPage } from './player-requests.page';

describe('PlayerRequestsPage', () => {
  let component: PlayerRequestsPage;
  let fixture: ComponentFixture<PlayerRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerRequestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
