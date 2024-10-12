import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordChangeModalComponent } from './password-change-modal.component';

describe('PasswordChangeModalComponent', () => {
  let component: PasswordChangeModalComponent;
  let fixture: ComponentFixture<PasswordChangeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordChangeModalComponent ],
      imports: [.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
