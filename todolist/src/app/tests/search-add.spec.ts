import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js'
import 'zone.js/testing';
import { SearchAdd } from '../components/search-add/search-add';
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

  it('should preview search toggle when in add task mode', () => {
    component.wannaAdd = true;
    fixture.detectChanges();

    const modeBtn = fixture.nativeElement.querySelector('#mode');
    expect(modeBtn.textContent.trim()).toEqual('Search');
  });

  it('should preview add toggle when in search task mode', () => {
    component.wannaAdd = false;
    fixture.detectChanges();

    const modeBtn = fixture.nativeElement.querySelector('#mode');
    expect(modeBtn.textContent.trim()).toEqual('Add');
  });

  it('should not preview search bar when in add task mode', () => {
    component.wannaAdd = true;
    fixture.detectChanges();

    const searchBar = fixture.nativeElement.querySelector('#search-field');
    expect(searchBar.hidden).toBeTrue();
  });

  it('should not preview input task bar when in search task mode', () => {
    component.wannaAdd = false;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#input');
    expect(input.hidden).toBeTrue();
  });

  it('should not preview add task button when in search task mode', () => {
    component.wannaAdd = false;
    fixture.detectChanges();

    const addBtn = fixture.nativeElement.querySelector('#add');
    expect(addBtn.hidden).toBeTrue();
  });

});
