import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectagentComponent } from './selectagent.component';

describe('SelectagentComponent', () => {
  let component: SelectagentComponent;
  let fixture: ComponentFixture<SelectagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
