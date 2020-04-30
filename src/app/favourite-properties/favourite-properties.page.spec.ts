import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavouritePropertiesPage } from './favourite-properties.page';

describe('FavouritePropertiesPage', () => {
  let component: FavouritePropertiesPage;
  let fixture: ComponentFixture<FavouritePropertiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouritePropertiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritePropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
