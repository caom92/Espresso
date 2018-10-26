import { Component } from '@angular/core'
import { StateService } from '@uirouter/core'

import { BackendService } from '../../../../services/app.backend'
import { SuperInventoryViewer } from '../../super-inventory/super.inventory.viewer'

@Component({
  selector: 'gmp-packing-cold-room-temp-inventory-viewer',
  templateUrl: './gmp.packing.cold.room.temp.inventory.viewer.component.html'
})

export class GMPPackingColdRoomTempInventoryViewerComponent extends SuperInventoryViewer {
  constructor(router: StateService, server: BackendService) {
    super(router, server)
  }
}