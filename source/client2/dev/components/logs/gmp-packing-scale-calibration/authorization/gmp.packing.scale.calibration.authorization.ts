import { Component } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Language } from 'angular-l10n'

import { CustomValidators } from '../../../../directives/custom.validators'
import { LogService } from '../../../../services/log.service'
import { ToastsService } from '../../../../services/toasts.service'
import { SuperAuthorizationComponent } from '../../super-logs/super.logs.authorization'
import { Authorization } from '../interfaces/gmp.packing.scale.calibration.authorization.interface'
import { UpdateItem, UpdateType } from '../interfaces/gmp.packing.scale.calibration.update.interface'

@Component({
  selector: 'gmp-packing-scale-calibration-authorization',
  templateUrl: './gmp.packing.scale.calibration.authorization.html'
})

export class GMPPackingScaleCalibrationAuthorizationComponent extends SuperAuthorizationComponent {
  @Language() lang: string
  log: Authorization

  constructor(_fb: FormBuilder, toastService: ToastsService, logService: LogService, routeState: ActivatedRoute, router: Router) {
    super(_fb, logService, toastService, routeState, router)
  }

  ngOnInit() {
    this.setSuffix('gmp-packing-scale-calibration')
    super.ngOnInit()
    this.initForm()
  }

  initForm() {
    this.captureForm = this._fb.group({
      report_id: [this.log.report_id, [Validators.required]],
      date: [this.log.creation_date, [Validators.required, CustomValidators.dateValidator()]],
      notes: [this.log.notes, [Validators.maxLength(65535)]],
      corrective_action: [this.log.corrective_action, [Validators.maxLength(65535)]],
      types: this._fb.array([])
    })
    const control = <FormArray>this.captureForm.controls['types']
    for (let type of this.log.types.scales) {
      let itemControl = []
      for (let item of type.items) {
        itemControl.push(this.initItem({ id: item.id, test: item.test, unit_id: item.unit, status: (item.status == 1) ? true : false, quantity: item.quantity, is_sanitized: (item.is_sanitized == 1) ? true : false }))
      }
      control.push(this.initType({ id: type.id, time: type.time, items: itemControl }))
    }
  }

  initType(type: UpdateType) {
    return this._fb.group({
      id: [type.id, [Validators.required]],
      time: [type.time, [Validators.required]],
      items: this._fb.array(type.items)
    })
  }

  initItem(item: UpdateItem) {
    return this._fb.group({
      id: [item.id, [Validators.required]],
      test: [item.test, [Validators.required]],
      unit_id: [item.unit_id, [Validators.required]],
      quantity: [item.quantity],
      status: [item.status, [Validators.required]],
      is_sanitized: [item.is_sanitized, []]
    })
  }

  public cleanForm(): void {
    for (let t in (<FormGroup>this.captureForm.controls.types).controls) {
      const type = (<FormGroup>(<FormGroup>this.captureForm.controls.types).controls[t])
      for (let i in (<FormGroup>type.controls.items).controls) {
        const item = (<FormGroup>(<FormGroup>type.controls.items).controls[i])
        const quantityControl = (<FormGroup>item).controls.quantity
        const unitControl = (<FormGroup>item).controls.unit_id

        if (quantityControl.value === null || quantityControl.value === '') {
          quantityControl.disable()
        }

        if (unitControl.value === null || unitControl.value === '') {
          unitControl.disable()
        }
      }
    }
  }

  public enableForm(): void {
    for (let t in (<FormGroup>this.captureForm.controls.types).controls) {
      const type = (<FormGroup>(<FormGroup>this.captureForm.controls.types).controls[t])
      for (let i in (<FormGroup>type.controls.items).controls) {
        const item = (<FormGroup>(<FormGroup>type.controls.items).controls[i])
        const quantityControl = (<FormGroup>item).controls.quantity
        const unitControl = (<FormGroup>item).controls.unit_id

        quantityControl.enable()
        unitControl.enable()
      }
    }
  }
}
