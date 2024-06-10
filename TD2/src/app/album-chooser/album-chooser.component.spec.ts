import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumChooserComponent } from './album-chooser.component';

describe('AlbumChooserComponent', () => {
  let component: AlbumChooserComponent;
  let fixture: ComponentFixture<AlbumChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumChooserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlbumChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
