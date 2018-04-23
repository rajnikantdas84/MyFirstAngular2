import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantAccountInfoComponent } from './tenant-account-info.component';

describe('TenantAccountInfoComponent', () => {
  let component: TenantAccountInfoComponent;
  let fixture: ComponentFixture<TenantAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
