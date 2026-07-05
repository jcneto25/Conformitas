import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;
  let component: SkeletonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should render text skeleton by default', () => {
    fixture.detectChanges();

    const lines = fixture.debugElement.queryAll(By.css('.animate-pulse'));
    expect(lines.length).toBe(3);
  });

  it('should render card skeleton', () => {
    component.type = 'card';
    fixture.detectChanges();

    const cardContainer = fixture.debugElement.nativeElement.querySelector('.bg-surface.rounded-lg');
    expect(cardContainer).not.toBeNull();

    const lines = fixture.debugElement.queryAll(By.css('.animate-pulse'));
    expect(lines.length).toBe(4); // title + 3 content lines
  });

  it('should render table-row skeleton with correct rows and cols', () => {
    component.type = 'table-row';
    component.rows = 3;
    component.cols = 4;
    fixture.detectChanges();

    const flexContainers = fixture.debugElement.queryAll(By.css('.flex.gap-4'));
    expect(flexContainers.length).toBe(3);

    const cells = fixture.debugElement.queryAll(By.css('.flex-1'));
    expect(cells.length).toBe(12); // 3 rows × 4 cols
  });

  it('should default to 5 rows for table-row', () => {
    component.type = 'table-row';
    fixture.detectChanges();

    const flexContainers = fixture.debugElement.queryAll(By.css('.flex.gap-4'));
    expect(flexContainers.length).toBe(5);
  });
});
