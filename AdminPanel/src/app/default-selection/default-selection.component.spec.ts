import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSelectionComponent } from './default-selection.component';

describe('DefaultSelectionComponent', () => {
  let component: DefaultSelectionComponent;
  let fixture: ComponentFixture<DefaultSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
