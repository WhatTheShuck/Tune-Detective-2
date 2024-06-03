import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistChooserComponent } from './artist-chooser.component';

describe('ArtistChooserComponent', () => {
  let component: ArtistChooserComponent;
  let fixture: ComponentFixture<ArtistChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistChooserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
