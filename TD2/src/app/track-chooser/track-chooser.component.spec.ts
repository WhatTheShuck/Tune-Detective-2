import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackChooserComponent } from './track-chooser.component';

describe('TrackChooserComponent', () => {
  let component: TrackChooserComponent;
  let fixture: ComponentFixture<TrackChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackChooserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
