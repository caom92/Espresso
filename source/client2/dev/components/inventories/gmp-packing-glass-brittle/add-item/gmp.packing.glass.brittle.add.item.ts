import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Language, TranslationService } from 'angular-l10n'
import { PubSubService } from 'angular2-pubsub'

import { AlertController } from '../../../../services/alert/app.alert'
import { InventoryService } from '../../../../services/app.inventory'
import { ToastsService } from '../../../../services/app.toasts'
import { SuperInventoryAddItemComponent } from '../../super-inventory/super.inventory.add.item'

@Component({
  selector: '[gmp-packing-glass-brittle-add-item]',
  templateUrl: './gmp.packing.glass.brittle.add.item.html'
})

export class GMPPackingGlassBrittleAddItemComponent extends SuperInventoryAddItemComponent implements OnInit {
  @Language() lang: string
  @Input() types: Array<any> = []
  @Input('area') area_id: number
  newItem: FormGroup = new FormBuilder().group({})
  
  constructor(alertCtrl: AlertController, translationService: TranslationService, _fb: FormBuilder, inventoryService: InventoryService, events: PubSubService, toastService: ToastsService) {
    super(_fb, alertCtrl, translationService, inventoryService, events, toastService)
  }

  public ngOnInit(): void {
    this.setSuffix('gmp-packing-glass-brittle')
    this.createItemForm({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      quantity: ['',[Validators.required]]
    })
  }

  public addItem(): void {
    let data = { item: { id: 0, is_active: 1, name: this.newItem.value.name, position: 0, quantity: this.newItem.value.quantity } }
    let itemData = { name: this.newItem.value.name, area_id: this.area_id, quantity: this.newItem.value.quantity }
    super.addItem(data, itemData)
  }
}