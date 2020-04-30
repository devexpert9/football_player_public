import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FeespayComponent } from './feespay.component';

describe('FeespayComponent', () => {
  let component: FeespayComponent;
  let fixture: ComponentFixture<FeespayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeespayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeespayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
