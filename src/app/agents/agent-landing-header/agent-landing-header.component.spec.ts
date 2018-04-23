import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLandingHeaderComponent } from './agent-landing-header.component';

describe('AgentLandingHeaderComponent', () => {
  let component: AgentLandingHeaderComponent;
  let fixture: ComponentFixture<AgentLandingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLandingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLandingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
