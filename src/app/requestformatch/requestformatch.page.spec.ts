import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestformatchPage } from './requestformatch.page';

describe('RequestformatchPage', () => {
  let component: RequestformatchPage;
  let fixture: ComponentFixture<RequestformatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestformatchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestformatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
