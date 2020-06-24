import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllchatsPage } from './allchats.page';

describe('AllchatsPage', () => {
  let component: AllchatsPage;
  let fixture: ComponentFixture<AllchatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllchatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllchatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
