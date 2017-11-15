import { Component, ComponentFactoryResolver, OnInit } from '@angular/core'

import { NavParams, Events } from 'ionic-angular'

import { Language } from 'angular-l10n'

import { Observable } from 'rxjs/Rx'

import { BackendService } from '../../services/app.backend'
import { TranslationService } from '../../services/app.translation'
import { ToastService } from '../../services/app.toasts'

import { DynamicNavbarPageComponent } from '../super-components/dynamic.navbar.component'

import { GMPPackingScaleCalibrationInventoryComponent } from './gmp-packing-scale-calibration/inventory/gmp.packing.scale.calibration.inventory'
import { GMPPackingPreopInventoryComponent } from './gmp-packing-preop/inventory/gmp.packing.preop.inventory'
import { GMPPackingPreopInventoryManagerComponent } from './gmp-packing-preop/manager/gmp.packing.preop.inventory.manager'

@Component({
  selector: 'inventories',
  templateUrl: 'inventories.html',
  providers: [
    BackendService,
    TranslationService,
    ToastService
  ]
})

export class InventoryLoaderComponent extends DynamicNavbarPageComponent implements OnInit {
  @Language()
  lang: string

  loaderComponent: any = null
  inventorySuffix: string = ""
  title: string = ""

  constructor(public translationService: TranslationService, public events: Events, factoryResolver: ComponentFactoryResolver, public navParams: NavParams) {
    super(translationService, events, factoryResolver)
    this.inventorySuffix = this.navParams.get('log_suffix')
    this.title = this.navParams.get('log_title')
  }

  ngOnInit(){
    switch(this.inventorySuffix){
      case 'gmp-packing-scale-calibration': this.loaderComponent = this.loadComponent(GMPPackingScaleCalibrationInventoryComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-preop': this.loaderComponent = this.loadComponent(GMPPackingPreopInventoryManagerComponent, {
          parent: this
        }).instance
          break
    }
  }
}