import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantLoginComponent } from './tenant-login.component';

describe('TenantLoginComponent', () => {
  let component: TenantLoginComponent;
  let fixture: ComponentFixture<TenantLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
