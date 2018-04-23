import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCommentsComponent } from './issue-comments.component';

describe('IssueCommentsComponent', () => {
  let component: IssueCommentsComponent;
  let fixture: ComponentFixture<IssueCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
