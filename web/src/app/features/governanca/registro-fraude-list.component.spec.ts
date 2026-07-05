import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RegistroFraudeListComponent } from './registro-fraude-list.component';

describe('RegistroFraudeListComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [RegistroFraudeListComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(RegistroFraudeListComponent)).toBeTruthy());
});
