import { Component, Input } from '@angular/core'
import { Language } from 'angular-l10n'
import { PubSubService } from 'angular2-pubsub'
import { DragulaService } from 'ng2-dragula'

import { InventoryService } from '../../../../services/inventory.service'
import { SuperInventoryComponent } from '../../super-inventory/super.inventory'
import { InventoryItem } from '../interfaces/gmp-packing-bathroom-cleaning-inventory.interface'

@Component({
  selector: 'gmp-packing-bathroom-cleaning-inventory',
  templateUrl: './gmp-packing-bathroom-cleaning-inventory.component.html'
})

export class GMPPackingBathroomCleaningInventoryComponent extends SuperInventoryComponent {
  @Language() lang: string
  @Input() inventory: Array<InventoryItem> = []

  constructor(events: PubSubService,
    inventoryService: InventoryService,
    dragulaService: DragulaService) {
    super(dragulaService, events, inventoryService)
  }

  public ngOnInit(): void {
    this.setSuffix('gmp-packing-bathroom-cleaning')
    this.setBagName(this.suffix + '-bag')
    super.ngOnInit()
  }

  public onInventoryUpdate(): void {
    // Se debe reimplmentar para evitar que se lance la excepción
  }

  public checkEmptyInventory(): boolean {
    this.emptyInventoryFlag = this.inventory.length == 0
    return this.inventory.length == 0
  }

  public initDragula(): void {
    this.addGroup(this.bagName)
  }
}