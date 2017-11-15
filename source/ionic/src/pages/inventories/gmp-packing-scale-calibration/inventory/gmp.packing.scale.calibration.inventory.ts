import { Component, Input, OnInit } from '@angular/core'
import { ModalController, Events, NavController } from 'ionic-angular'

import { Language, TranslationService as TService } from 'angular-l10n'
import { Observable } from 'rxjs/Rx'

import { InventoryType } from '../interfaces/gmp.packing.scale.calibration.inventory.interface'

import { HideFabDirective } from '../../../../directives/hide.fab'

import { GMPPackingScaleCalibrationAddItemComponent } from '../add-item/gmp.packing.scale.calibration.add.item'

import { BackendService } from '../../../../services/app.backend'
import { ToastService } from '../../../../services/app.toasts'
import { LoaderService } from '../../../../services/app.loaders'

@Component({
  selector: 'gmp-packing-scale-calibration-inventory',
  templateUrl: './gmp.packing.scale.calibration.inventory.html',
  providers: [
    BackendService,
    ToastService,
    LoaderService
  ]
})

export class GMPPackingScaleCalibrationInventoryComponent implements OnInit {
  @Language()
  lang: string

  @Input()
  inventory: Array<InventoryType> = []

  emptyInventoryFlag: boolean = null

  scrollAllowed: boolean = true

  constructor(public events: Events, public modalController: ModalController, public server: BackendService, public navCtrl: NavController, public loaderService: LoaderService, public ts: TService, private toastService: ToastService){

  }

  ngOnInit(){
    this.events.subscribe("scroll:stop", (message) => {
      this.scrollAllowed = false
      console.log("Message: " + message)
    })

    this.events.subscribe("scroll:start", (message)=>{
      this.scrollAllowed = true
      console.log("Message: " + message)
    })

    let loader = this.loaderService.koiLoader(this.ts.translate("Connecting to Server"))
    loader.present()
    this.server.update(
      'inventory-gmp-packing-scale-calibration',
      new FormData(),
      (response: any) => {
        if (response.meta.return_code == 0) {
          if (response.data) {
            this.inventory = response.data
            this.checkEmptyInventory()
            loader.dismiss()
          } else {
            loader.dismiss()
            this.toastService.showText("serverUnreachable")
            this.navCtrl.pop()
          }
        }
      },
      (error: any, caught: Observable<void>) => {
        loader.dismiss()
        this.toastService.showText("serverUnreachable")
        this.navCtrl.pop()
        return []
      }
    )
  }

  addItem(){
    let type_array: Array<{id:number,name:string}> = []
    for(let temp of this.inventory){
      type_array.push({id:temp.id,name:temp.name})
    }
    let modal = this.modalController.create(GMPPackingScaleCalibrationAddItemComponent, {type_array:type_array})
    modal.present()
    modal.onDidDismiss(data => {
      if(data){
        for(let type in this.inventory){
          if(this.inventory[type].id == data.type){
            data.item.order = this.inventory[type].items.length + 1
            this.inventory[type].items.push(data.item)
            this.emptyInventoryFlag = false
          }
        }
      }
    })
  }

  checkEmptyInventory(){
    let emptyCount = 0
    for(let type of this.inventory){
      if(type.items.length == 0){
        emptyCount++
      }
    }

    if(emptyCount == this.inventory.length){
      this.emptyInventoryFlag = true
      return true
    } else {
      this.emptyInventoryFlag = false
      return false
    }
  }
}