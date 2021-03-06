import { Component, Input } from '@angular/core'
import { Language } from 'angular-l10n'
import { Events, ModalController } from 'ionic-angular'

import { SuperInventoryAreaComponent } from '../../super-inventory/super.area.inventory.area'
import { GAPPackingPreopEditAreaComponent } from '../edit-area/gap.packing.preop.edit.area'
import { InventoryArea } from '../interfaces/gap.packing.preop.area.inventory.interface'

@Component({
  selector: 'gap-packing-preop-area-inventory-area',
  templateUrl: './gap.packing.preop.area.inventory.area.html'
})

export class GAPPackingPreopAreaInventoryAreaComponent extends SuperInventoryAreaComponent {
  @Input() area: InventoryArea
  @Language() lang: string

  constructor(modalController: ModalController, events: Events) {
    super(modalController, events)
  }

  editArea() {
    super.editArea(GAPPackingPreopEditAreaComponent, { area_id: this.area.id, area_name: this.area.name }, (data) => {
      this.events.publish("area:edit", this.area, data.area)
      this.area.name = data.area.name
    })
  }
}