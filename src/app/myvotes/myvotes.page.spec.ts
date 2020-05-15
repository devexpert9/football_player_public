import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyvotesPage } from './myvotes.page';

describe('MyvotesPage', () => {
  let component: MyvotesPage;
  let fixture: ComponentFixture<MyvotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyvotesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyvotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
