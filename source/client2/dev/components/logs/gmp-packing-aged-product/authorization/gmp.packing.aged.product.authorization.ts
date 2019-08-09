import { Component } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Language } from 'angular-l10n'

import { CustomValidators } from '../../../../directives/custom.validators'
import { LanguageService } from '../../../../services/app.language'
import { LogService } from '../../../../services/log.service'
import { ToastsService } from '../../../../services/toasts.service'
import { SuperAuthorizationComponent } from '../../super-logs/super.logs.authorization'
import { Authorization, AuthorizationEntry } from '../interfaces/gmp.packing.aged.product.authorization.interface'

@Component({
  selector: 'gmp-packing-aged-product-authorization',
  templateUrl: './gmp.packing.aged.product.authorization.html'
})

export class GMPPackingAgedProductAuthorizationComponent extends SuperAuthorizationComponent {
  @Language() lang: string
  log: Authorization

  readonly maxLengths = {
    batch: 255,
    warehouse: 255,
    vendor: 255,
    item: 255,
    origin: 3,
    location: 255,
    notes: 65535,
    album_url: 65535
  }

  constructor(_fb: FormBuilder,
    private langManager: LanguageService,
    logService: LogService,
    toastService: ToastsService,
    routeState: ActivatedRoute,
    router: Router) {
    super(_fb, logService, toastService, routeState, router)
  }

  ngOnInit() {
    this.setSuffix('gmp-packing-aged-product')
    super.ngOnInit()
    this.initForm()
  }

  initForm() {
    this.captureForm = this._fb.group({
      report_id: [this.log.report_id, [Validators.required]],
      date: [this.log.creation_date, [Validators.required, CustomValidators.dateValidator()]],
      entries: this._fb.array([])
    })

    const control = <FormArray>this.captureForm.controls['entries']

    for (const entry of this.log.log_info.entries) {
      control.push(this.initEntry(entry))
    }
  }

  public initEntry(entry: AuthorizationEntry): FormGroup {
    return this._fb.group({
      batch: [entry.batch, [Validators.maxLength(this.maxLengths.batch)]],
      warehouse: [entry.warehouse, [Validators.maxLength(this.maxLengths.warehouse)]],
      vendor: [entry.vendor, [Validators.required, Validators.maxLength(this.maxLengths.vendor)]],
      item: [entry.item, [Validators.required, Validators.maxLength(this.maxLengths.item)]],
      age: [entry.age, [Validators.required]],
      quality_id: [entry.quality_id, [Validators.required]],
      origin: [entry.origin, [CustomValidators.exactLength(this.maxLengths.origin)]],
      packed_date: [entry.packed_date, [Validators.required, CustomValidators.dateValidator()]],
      quantity: [entry.quantity, [Validators.required, Validators.min(1)]],
      location: [entry.location, [Validators.maxLength(this.maxLengths.location)]],
      action_id: [entry.action_id, [Validators.required]],
      notes: [entry.notes, [Validators.maxLength(this.maxLengths.notes)]],
      album_url: [entry.album_url, [Validators.maxLength(this.maxLengths.album_url)]]
    })
  }

  public save(): void {
    for (let entry in ((<FormGroup>this.captureForm.controls.entries).controls)) {
      let temp = (<FormGroup>this.captureForm.controls.entries).controls[entry] as FormGroup
      let tempAge = (+(new Date(this.captureForm.controls.date.value)) - + new Date(temp.controls.packed_date.value)) / (1000 * 60 * 60 * 24)
      if (tempAge == Number(tempAge)) {
        temp.controls.age.setValue(tempAge)
      }
    }

    super.save()
  }
}