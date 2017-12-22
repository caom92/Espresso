import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Events } from 'ionic-angular'

import { ISubscription } from 'rxjs/Subscription'

import { Language } from 'angular-l10n'

import { InventoryItem } from '../interfaces/gmp.packing.thermo.calibration.inventory.interface'

import { DragulaService } from 'ng2-dragula'

import { BackendService } from '../../../../services/app.backend'

@Component({
  selector: 'gmp-packing-thermo-calibration-inventory-list',
  templateUrl: './gmp.packing.thermo.calibration.inventory.list.html',
  providers: [
    BackendService,
    DragulaService
  ]
})

export class GMPPackingThermoCalibrationInventoryListComponent implements OnInit, OnDestroy {
  @Language()
  lang: string

  @Input()
  items: Array<InventoryItem>

  drag: ISubscription = null
  dragend: ISubscription = null

  constructor(private dragulaService: DragulaService, public events: Events, public server: BackendService) {
    
  }

  ngOnInit(){
    this.dragulaService.setOptions("thermo-calibration-bag", {
      moves: function (el, container, handle) {
        return (handle.classList.contains('handle'))
      },
      revertOnSpill: true
    })

    this.drag = this.dragulaService.drag.subscribe((value) => {
      this.events.publish("scroll:stop", "Scroll Stopped")
    })

    this.dragend = this.dragulaService.dragend.subscribe((value) => {
      this.events.publish("scroll:start", "Scroll Started")
      let index = 1
      for(let item in this.items){
        this.items[item].position = index++
        let reorderForm = new FormData()
        reorderForm.append("item_id", "" + this.items[item].id)
        reorderForm.append("position", "" + this.items[item].position)
        this.server.update(
          'reorder-gmp-packing-thermo-calibration',
          reorderForm,
          (response: any) => {
            console.log("Item reordered")
          }
        )
      }
    })
  }

  ngOnDestroy(){
    if (this.dragulaService.find("thermo-calibration-bag") !== undefined){
      console.warn("Dragula bag " + "thermo-calibration-bag" + " destroyed")
      this.drag.unsubscribe()
      this.dragend.unsubscribe()
      this.dragulaService.destroy("thermo-calibration-bag")
    } else {
      console.error("No Dragula bag present on gmp-packing-thermo-calibration Inventory")
    }
  }
}