import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Batch } from './batch.model';
import { BatchService } from './batch.service';

@Component({
  selector: 'page-batch-update',
  templateUrl: 'batch-update.html',
})
export class BatchUpdatePage implements OnInit {
  batch: Batch;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    year: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private batchService: BatchService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.batch = response.data;
      this.isNew = this.batch.id === null || this.batch.id === undefined;
      this.updateForm(this.batch);
    });
  }

  updateForm(batch: Batch) {
    this.form.patchValue({
      id: batch.id,
      year: batch.year,
    });
  }

  save() {
    this.isSaving = true;
    const batch = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.batchService.update(batch));
    } else {
      this.subscribeToSaveResponse(this.batchService.create(batch));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Batch>>) {
    result.subscribe(
      (res: HttpResponse<Batch>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Batch ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/batch');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm(): Batch {
    return {
      ...new Batch(),
      id: this.form.get(['id']).value,
      year: this.form.get(['year']).value,
    };
  }
}
