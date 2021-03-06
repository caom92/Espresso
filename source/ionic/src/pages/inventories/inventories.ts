import { Component, ComponentFactoryResolver, OnInit } from '@angular/core'
import { Storage } from '@ionic/storage'
import { Language } from 'angular-l10n'
import { Events, NavParams } from 'ionic-angular'

import { BackendService } from '../../services/app.backend'
import { TranslationService } from '../../services/app.translation'
import { DynamicNavbarPageComponent } from '../super-components/dynamic.navbar.component'
import { GAPPackingPreopInventoryManagerComponent } from './gap-packing-preop/manager/gap.packing.preop.inventory.manager'
import { GMPPackingColdRoomTempInventoryComponent } from './gmp-packing-cold-room-temp/inventory/gmp.packing.cold.room.temp.inventory'
import { GMPPackingGlassBrittleInventoryManagerComponent } from './gmp-packing-glass-brittle/manager/gmp.packing.glass.brittle.inventory.manager'
import { GMPPackingHandWashingInventoryComponent } from './gmp-packing-hand-washing/inventory/gmp.packing.hand.washing.inventory'
import { GMPPackingPreopInventoryManagerComponent } from './gmp-packing-preop/manager/gmp.packing.preop.inventory.manager'
import { GMPPackingScaleCalibrationInventoryComponent } from './gmp-packing-scale-calibration/inventory/gmp.packing.scale.calibration.inventory'
import { GMPPackingScissorsKnivesInventoryComponent } from './gmp-packing-scissors-knives/inventory/gmp.packing.scissors.knives.inventory'
import { GMPPackingThermoCalibrationInventoryComponent } from './gmp-packing-thermo-calibration/inventory/gmp.packing.thermo.calibration.inventory'
import { GMPSelfInspectionPestControlInventoryManagerComponent } from './gmp-self-inspection-pest-control/manager/gmp.self.inspection.pest.control.inventory.manager'
import { GMPDocControlDocControlInventoryComponent } from './gmp-doc-control-doc-control/inventory/gmp.doc.control.doc.control.inventory'

@Component({
  selector: 'inventories',
  templateUrl: 'inventories.html'
})

export class InventoryLoaderComponent extends DynamicNavbarPageComponent implements OnInit {
  @Language() lang: string
  private loaderComponent: any = null
  private inventorySuffix: string = ""
  private title: string = ""

  constructor(public translationService: TranslationService,
    public events: Events,
    public storage: Storage,
    factoryResolver: ComponentFactoryResolver,
    public navParams: NavParams,
    public server: BackendService) {
    super(translationService, events, storage, server, factoryResolver)
  }

  public ngOnInit(): void {
    this.inventorySuffix = this.navParams.get('log_suffix')
    this.title = this.navParams.get('log_title')
    switch (this.inventorySuffix) {
      case 'gmp-packing-scale-calibration': this.loaderComponent = this.loadComponent(GMPPackingScaleCalibrationInventoryComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-preop': this.loaderComponent = this.loadComponent(GMPPackingPreopInventoryManagerComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-scissors-knives': this.loaderComponent = this.loadComponent(GMPPackingScissorsKnivesInventoryComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-thermo-calibration': this.loaderComponent = this.loadComponent(GMPPackingThermoCalibrationInventoryComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-hand-washing': this.loaderComponent = this.loadComponent(GMPPackingHandWashingInventoryComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-cold-room-temp': this.loaderComponent = this.loadComponent(GMPPackingColdRoomTempInventoryComponent, {
        parent: this
      }).instance
        break
      case 'gmp-packing-glass-brittle': this.loaderComponent = this.loadComponent(GMPPackingGlassBrittleInventoryManagerComponent, {
        parent: this
      }).instance
        break
      case 'gap-packing-preop': this.loaderComponent = this.loadComponent(GAPPackingPreopInventoryManagerComponent, {
        parent: this
      }).instance
        break
      case 'gmp-self-inspection-pest-control': this.loaderComponent = this.loadComponent(GMPSelfInspectionPestControlInventoryManagerComponent, {
        parent: this
      }).instance
        break
      case 'gmp-doc-control-doc-control': this.loaderComponent = this.loadComponent(GMPDocControlDocControlInventoryComponent, {
        parent: this
      }).instance
        break
    }
  }
}