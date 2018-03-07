import { Component, Input } from '@angular/core'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { FormBuilder, Validators } from '@angular/forms'
import { Language, TranslationService as TService } from 'angular-l10n'
import { PubSubService } from 'angular2-pubsub'

import { AlertController } from '../../../../services/alert/app.alert'
import { AreaManagerService } from '../../../../services/app.area.manager'
import { SuperInventoryAreaComponent } from '../../super-inventory/super.area.inventory.area'
import { SuperInventoryEditAreaInterface } from '../../super-inventory/super.area.inventory.interface'
import { InventoryArea } from '../interfaces/gmp.self.inspection.pest.control.area.inventory.interface'

@Component({
  selector: '[gmp-self-inspection-pest-control-area-inventory-area]',
  templateUrl: './gmp.self.inspection.pest.control.area.inventory.area.html'
})

export class GMPSelfInspectionPestControlAreaInventoryAreaComponent extends SuperInventoryAreaComponent implements OnInit {
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
    this.setSuffix("gmp-self-inspection-pest-control")
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
    super.editArea(GMPSelfInspectionPestControlEditAreaComponent, { area_id: this.area.id, area_name: this.area.name }, (data) => {
      this.events.publish("area:edit", this.area, data.area)
      this.area.name = data.area.name
    })
  }*/
}