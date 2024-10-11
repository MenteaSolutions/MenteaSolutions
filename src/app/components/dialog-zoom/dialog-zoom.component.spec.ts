import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogZoomComponent } from './dialog-zoom.component';

describe('DialogZoomComponent', () => {
  let component: DialogZoomComponent;
  let fixture: ComponentFixture<DialogZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogZoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
