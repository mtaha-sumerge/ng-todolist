import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js'
import 'zone.js/testing';
import { SearchAdd } from './search-add';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SearchAdd', () => {
  let component: SearchAdd;
  let fixture: ComponentFixture<SearchAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAdd],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
