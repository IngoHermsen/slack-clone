import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadOverviewComponent } from './thread-overview.component';

describe('ThreadOverviewComponent', () => {
  let component: ThreadOverviewComponent;
  let fixture: ComponentFixture<ThreadOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
