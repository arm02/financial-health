import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansForm } from './loans-form';

describe('LoansForm', () => {
  let component: LoansForm;
  let fixture: ComponentFixture<LoansForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
