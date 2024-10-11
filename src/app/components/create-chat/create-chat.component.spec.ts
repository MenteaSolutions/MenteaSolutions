import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChatComponent } from './create-chat.component';

describe('CreateChatComponent', () => {
  let component: CreateChatComponent;
  let fixture: ComponentFixture<CreateChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
