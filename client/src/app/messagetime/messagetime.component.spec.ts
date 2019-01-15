import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagetimeComponent } from './messagetime.component';

describe('MessagetimeComponent', () => {
  let component: MessagetimeComponent;
  let fixture: ComponentFixture<MessagetimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagetimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
