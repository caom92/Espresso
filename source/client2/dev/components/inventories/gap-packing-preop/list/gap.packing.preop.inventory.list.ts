import { Component, Input } from '@angular/core'
import { PubSubService } from 'angular2-pubsub'
import { Language } from 'angular-l10n'
import { DragulaService } from 'ng2-dragula'

import { InventoryService } from '../../../../services/inventory.service'
import { SuperInventoryListComponent } from '../../super-inventory/super.inventory.list'
import { InventoryItem, InventoryType } from '../interfaces/gap.packing.preop.inventory.interface'

@Component({
  selector: '[gap-packing-preop-inventory-list]',
  templateUrl: './gap.packing.preop.inventory.list.html'
})

export class GAPPackingPreopInventoryListComponent extends SuperInventoryListComponent {
  @Language() lang: string
  @Input() items: Array<InventoryItem>
  @Input() type: InventoryType
  @Input() areaID: number

  constructor(dragulaService: DragulaService,
    events: PubSubService,
    inventoryService: InventoryService) {
    super(dragulaService, events, inventoryService)
  }

  public ngOnInit(): void {
    this.setBagName(this.type.en)
    this.setSuffix('gap-packing-preop')
    super.ngOnInit()
  }

  public onItemAdd(item: any): void {
    if (item.type == this.type.id && item.area_id == this.areaID) {
      item.item.position = this.getCurrentInventory().length + 1
      this.getCurrentInventory().push(item.item)
      item.added = true
    }
  }

  public getCurrentInventory(): Array<InventoryItem> {
    return this.type.inventory
  }
}