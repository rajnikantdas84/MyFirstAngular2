import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUpdateIssueComponent } from './tenant-update-issue.component';

describe('TenantUpdateIssueComponent', () => {
  let component: TenantUpdateIssueComponent;
  let fixture: ComponentFixture<TenantUpdateIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantUpdateIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantUpdateIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
