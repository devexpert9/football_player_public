import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnerProfilePage } from './owner-profile.page';

describe('OwnerProfilePage', () => {
  let component: OwnerProfilePage;
  let fixture: ComponentFixture<OwnerProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
