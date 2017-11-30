import { Component, Input, ViewChild, OnInit } from '@angular/core'
import { Events, ModalController } from 'ionic-angular'

import { Language } from 'angular-l10n'

import { Observable } from 'rxjs/Rx'

import { InventoryArea } from '../interfaces/gmp.packing.glass.brittle.area.inventory.interface'

import { GMPPackingGlassBrittleEditAreaComponent } from '../edit-area/gmp.packing.glass.brittle.edit.area'

import { BackendService } from '../../../../services/app.backend'
import { ToastService } from '../../../../services/app.toasts'
import { LoaderService } from '../../../../services/app.loaders'

@Component({
  selector: 'gmp-packing-glass-brittle-area-inventory-area',
  templateUrl: './gmp.packing.glass.brittle.area.inventory.area.html',
  providers: [
    BackendService,
    ToastService,
    LoaderService
  ]
})

export class GMPPackingGlassBrittleAreaInventoryAreaComponent implements OnInit {
  @Input()
  area: InventoryArea

  @Language()
  lang: string

  constructor(public server: BackendService, public loaderService: LoaderService, private toastService: ToastService, public modalController: ModalController, public events: Events){

  }

  ngOnInit(){
    
  }

  editArea(){
    console.log("Edit Area")
    let editModal = this.modalController;

    let modal = this.modalController.create(GMPPackingGlassBrittleEditAreaComponent, {area_id:this.area.id})
    modal.present()
    modal.onDidDismiss(data => {
      if(data){
        this.events.publish("area:edit", this.area, data.area)
        this.area.name = data.area.name
      }
    })
  }
}