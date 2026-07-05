import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './page-header.component';

@Component({
  standalone: true,
  imports: [PageHeaderComponent],
  template: `<app-page-header title="Test"><button actions>Action</button></app-page-header>`,
})
class TestHostComponent {}

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;
  let component: PageHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent, RouterModule.forRoot([]), TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should display title', () => {
    component.title = 'Dashboard';
    fixture.detectChanges();

    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('Dashboard');
  });

  it('should display empty title by default', () => {
    fixture.detectChanges();

    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('');
  });

  it('should render breadcrumbs when provided', () => {
    component.breadcrumbs = [
      { label: 'Home', route: '/dashboard' },
      { label: 'Auditorias' },
    ];
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav'));
    expect(nav).not.toBeNull();

    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(1);
    expect(links[0].nativeElement.textContent).toBe('Home');
  });

  it('should render chevron between breadcrumbs', () => {
    component.breadcrumbs = [
      { label: 'Home', route: '/dashboard' },
      { label: 'Auditorias' },
    ];
    fixture.detectChanges();

    const chevrons = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(chevrons.length).toBe(1);
  });

  it('should not render breadcrumb nav when empty', () => {
    component.breadcrumbs = [];
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav'));
    expect(nav).toBeNull();
  });

  it('should render actions slot', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const actionBtn = hostFixture.debugElement.query(By.css('[actions]'));
    expect(actionBtn).not.toBeNull();
  });
});
