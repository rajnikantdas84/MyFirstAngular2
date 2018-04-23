import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsettingsComponent } from './agentsettings.component';

describe('AgentsettingsComponent', () => {
  let component: AgentsettingsComponent;
  let fixture: ComponentFixture<AgentsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
