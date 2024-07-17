import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSheetComponent } from './import-sheet.component';

describe('ImportSheetComponent', () => {
  let component: ImportSheetComponent;
  let fixture: ComponentFixture<ImportSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
