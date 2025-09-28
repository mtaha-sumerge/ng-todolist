import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdd } from './search-add';

describe('SearchAdd', () => {
  let component: SearchAdd;
  let fixture: ComponentFixture<SearchAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAdd]
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
