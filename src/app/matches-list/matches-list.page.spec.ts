import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatchesListPage } from './matches-list.page';

describe('MatchesListPage', () => {
  let component: MatchesListPage;
  let fixture: ComponentFixture<MatchesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
