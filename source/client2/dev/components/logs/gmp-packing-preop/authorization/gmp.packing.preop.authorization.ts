import { Component, Input, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms'

import { Language } from 'angular-l10n'

import { Authorization } from '../interfaces/gmp.packing.preop.authorization.interface'
import { UpdateArea, UpdateItem } from '../interfaces/gmp.packing.preop.update.interface'

import { ToastsService } from '../../../../services/app.toasts'
import { LogService } from '../../../../services/app.logs'
import { SuperAuthorizationComponent } from '../../super-logs/super.logs.authorization'

@Component({
  selector: 'gmp-packing-preop-authorization',
  templateUrl: './gmp.packing.preop.authorization.html'
})

export class GMPPackingPreopAuthorizationComponent extends SuperAuthorizationComponent implements OnInit {
  @Input() log: Authorization =  { report_id: null, created_by: null, approved_by: null, creation_date: null, approval_date: null, zone_name: null, program_name: null, module_name: null, log_name: null, notes: null, album_url: null, areas: { corrective_actions: [{ id: null, code: null, en: null, es: null }], logs: [{ id: null, name: null, person_performing_sanitation: null, notes: null, time: null, types: [{ id: null, en: null, es: null, items: [{ id: null, order: null, name: null, status: null, corrective_action_id: null, corrective_action: null, comment: null }] }] }] } }
  @Language() lang: string
  captureForm: FormGroup = new FormBuilder().group({})

  constructor(_fb: FormBuilder, toastService: ToastsService, logService: LogService) {
    super(_fb, logService, toastService)
  }

  ngOnInit() {
    this.setSuffix("gmp-packing-preop")
    super.ngOnInit()
    this.initForm()
  }

  initForm() {
    this.captureForm = this._fb.group({
      report_id: [this.log.report_id, [Validators.required, Validators.minLength(1)]],
      notes: [this.log.notes, [Validators.required, Validators.minLength(1)]],
      album_url: [this.log.album_url, [Validators.required, Validators.minLength(1)]],
      areas: this._fb.array([])
    })
    const control = <FormArray>this.captureForm.controls['areas'];
    for (let area of this.log.areas.logs) {
      let itemControl = []
      for (let type of area.types) {
        for (let item of type.items) {
          itemControl.push(this.initItem({ id: item.id, is_acceptable: (item.status == 1) ? true : false, corrective_action_id: item.corrective_action_id, comment: item.comment }))
        }
      }
      control.push(this.initArea({ id: area.id, time: area.time, notes: area.notes, person_performing_sanitation: area.person_performing_sanitation, items: itemControl }))
    }
  }

  initArea(area: UpdateArea) {
    return this._fb.group({
      id: [area.id, [Validators.required]],
      time: [area.time, [Validators.required, Validators.minLength(1)]],
      notes: [area.notes, [Validators.required, Validators.minLength(1)]],
      person_performing_sanitation: [area.person_performing_sanitation, [Validators.required, Validators.minLength(1)]],
      items: this._fb.array(area.items)
    })
  }

  initItem(item: UpdateItem) {
    return this._fb.group({
      id: [item.id, [Validators.required]],
      is_acceptable: [item.is_acceptable, [Validators.required]],
      corrective_action_id: [item.corrective_action_id],
      comment: [item.comment]
    })
  }
}
