import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsForm } from './savings-form';

describe('SavingsForm', () => {
  let component: SavingsForm;
  let fixture: ComponentFixture<SavingsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
