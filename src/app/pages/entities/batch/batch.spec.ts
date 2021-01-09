import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BatchPage } from './batch';

describe('BatchPage', () => {
  let component: BatchPage;
  let fixture: ComponentFixture<BatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot(), NgxWebstorageModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
