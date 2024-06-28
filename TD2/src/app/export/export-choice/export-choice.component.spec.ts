import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportChoiceComponent } from './export-choice.component';

describe('ExportChoiceComponent', () => {
  let component: ExportChoiceComponent;
  let fixture: ComponentFixture<ExportChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportChoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
