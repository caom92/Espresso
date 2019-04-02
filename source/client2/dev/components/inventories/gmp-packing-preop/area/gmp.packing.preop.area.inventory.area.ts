import { Component, Input } from '@angular/core'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { FormBuilder, Validators } from '@angular/forms'
import { Language } from 'angular-l10n'
import { PubSubService } from 'angular2-pubsub'

import { AreaManagerService } from '../../../../services/app.area.manager'
import { SuperInventoryAreaComponent } from '../../super-inventory/super.area.inventory.area'
import { SuperInventoryEditAreaInterface } from '../../super-inventory/super.area.inventory.interface'
import { InventoryArea } from '../interfaces/gmp.packing.preop.area.inventory.interface'

@Component({
  selector: '[gmp-packing-preop-area-inventory-area]',
  templateUrl: './gmp.packing.preop.area.inventory.area.html'
})

export class GMPPackingPreopAreaInventoryAreaComponent extends SuperInventoryAreaComponent implements OnInit {
  @Input() area: InventoryArea
  @Language() lang: string

  constructor(events: PubSubService, _fb: FormBuilder, areaManagerService: AreaManagerService) {
    super(events, _fb, areaManagerService)
  }

  public ngOnInit(): void {
    this.setSuffix('gmp-packing-preop')
    this.createItemForm({
      name: [String(this.area.name), [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    })
  }

  public openEditForm(): void {
    this.editMode = true
  }

  public confirm(): void {
    let form: SuperInventoryEditAreaInterface = { area_id: null, area_name: null }
    form.area_id = this.area.id
    form.room_id = this.area.id
    form.area_name = this.newArea.value.name
    form.name = this.newArea.value.name
    super.editArea(form)
  }
}