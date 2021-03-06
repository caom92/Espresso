import { Component, Input } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Language } from 'angular-l10n'
import { TranslationService as TService } from 'angular-l10n'
import { PubSubService } from 'angular2-pubsub'

import { AlertController } from '../../../../services/alert/app.alert'
import { AreaManagerService } from '../../../../services/app.area.manager'
import { SuperInventoryAreaComponent } from '../../super-inventory/super.area.inventory.area'
import { InventoryArea } from '../interfaces/gmp.packing.preop.area.inventory.interface'
import { SuperInventoryAreaInterface, SuperInventoryEditAreaInterface } from '../../super-inventory/super.area.inventory.interface'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { Validators } from '@angular/forms'

@Component({
  selector: '[gmp-packing-preop-area-inventory-area]',
  templateUrl: './gmp.packing.preop.area.inventory.area.html'
})

export class GMPPackingPreopAreaInventoryAreaComponent extends SuperInventoryAreaComponent implements OnInit {
  @Input() area: InventoryArea
  @Language() lang: string

  constructor(events: PubSubService,
    _fb: FormBuilder,
    alertCtrl: AlertController,
    ts: TService,
    areaManagerService: AreaManagerService) {
    super(events, _fb, alertCtrl, ts, areaManagerService)
  }

  public ngOnInit(): void {
    this.setSuffix("gmp-packing-preop")
    this.createItemForm({
      name: [String(this.area.name), [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    })
  }

  public openEditForm(): void {
    console.log("edit area")
    this.editMode = true
  }

  public confirm(): void {
    let form: SuperInventoryEditAreaInterface = { area_id: null, area_name: null }
    console.log("confirm")
    console.log(this.area)
    form.area_id = this.area.id
    form.room_id = this.area.id
    form.area_name = this.newArea.value.name
    form.name = this.newArea.value.name
    super.editArea(form)
  }

  /*editArea() {
    super.editArea(GMPPackingPreopEditAreaComponent, { area_id: this.area.id, area_name: this.area.name }, (data) => {
      this.events.publish("area:edit", this.area, data.area)
      this.area.name = data.area.name
    })
  }*/
}