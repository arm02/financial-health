import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansDetail } from './loans-detail';

describe('LoansDetail', () => {
  let component: LoansDetail;
  let fixture: ComponentFixture<LoansDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
