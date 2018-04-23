import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantForgotPasswordComponent } from './tenant-forgot-password.component';

describe('TenantForgotPasswordComponent', () => {
  let component: TenantForgotPasswordComponent;
  let fixture: ComponentFixture<TenantForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
