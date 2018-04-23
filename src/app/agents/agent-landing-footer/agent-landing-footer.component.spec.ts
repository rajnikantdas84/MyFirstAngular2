import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLandingFooterComponent } from './agent-landing-footer.component';

describe('AgentLandingFooterComponent', () => {
  let component: AgentLandingFooterComponent;
  let fixture: ComponentFixture<AgentLandingFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLandingFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLandingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
