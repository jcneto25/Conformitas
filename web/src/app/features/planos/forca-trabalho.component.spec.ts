import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ForcaTrabalhoComponent } from './forca-trabalho.component';

describe('ForcaTrabalhoComponent', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    httpSpy.get.and.returnValue(of([]));
    httpSpy.post.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ForcaTrabalhoComponent, FormsModule, NoopAnimationsModule],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForcaTrabalhoComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should accept planoId input', () => {
    const fixture = TestBed.createComponent(ForcaTrabalhoComponent);
    fixture.componentInstance.planoId = 'plano-1';
    expect(fixture.componentInstance.planoId).toBe('plano-1');
  });

  it('should accept forcaTrabalho input', () => {
    const fixture = TestBed.createComponent(ForcaTrabalhoComponent);
    const ft = [{ id: 'ft1', horasDisponiveisAno: 160 }];
    fixture.componentInstance.forcaTrabalho = ft;
    expect(fixture.componentInstance.forcaTrabalho).toEqual(ft);
  });
});
