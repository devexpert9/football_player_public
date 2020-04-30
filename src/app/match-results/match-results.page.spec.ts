import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatchResultsPage } from './match-results.page';

describe('MatchResultsPage', () => {
  let component: MatchResultsPage;
  let fixture: ComponentFixture<MatchResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchResultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
