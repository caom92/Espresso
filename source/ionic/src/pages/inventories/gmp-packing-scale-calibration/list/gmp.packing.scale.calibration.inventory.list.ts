import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Events } from 'ionic-angular'

import { ISubscription } from 'rxjs/Subscription'

import { Language } from 'angular-l10n'

import { InventoryType } from '../interfaces/gmp.packing.scale.calibration.inventory.interface'

import { DragulaService } from 'ng2-dragula'

import { BackendService } from '../../../../services/app.backend'

@Component({
  selector: 'gmp-packing-scale-calibration-inventory-list',
  templateUrl: './gmp.packing.scale.calibration.inventory.list.html',
  providers: [
    BackendService,
    DragulaService
  ]
})

export class GMPPackingScaleCalibrationInventoryListComponent implements OnInit, OnDestroy {
  @Language()
  lang: string

  @Input()
  type: InventoryType

  @Input()
  printHeader: boolean = false

  drag: ISubscription = null
  dragend: ISubscription = null

  constructor(private dragulaService: DragulaService, public events: Events, public server: BackendService) {
    
  }

  ngOnInit(){
    this.dragulaService.setOptions(this.type.name, {
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
      for(let item in this.type.items){
        this.type.items[item].order = index++
        let reorderForm = new FormData()
        reorderForm.append("item_id", "" + this.type.items[item].id)
        reorderForm.append("position", "" + this.type.items[item].order)
        this.server.update(
          'reorder-gmp-packing-scale-calibration',
          reorderForm,
          (response: any) => {
            console.log("Item reordered")
          }
        )
      }
    })
  }

  ngOnDestroy(){
    if (this.dragulaService.find(this.type.name) !== undefined){
      console.warn("Dragula bag " + this.type.name + " destroyed")
      this.drag.unsubscribe()
      this.dragend.unsubscribe()
      this.dragulaService.destroy(this.type.name)
    } else {
      console.error("No Dragula bag present on gmp-packing-scale-calibration Inventory")
    }
  }
}