import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Language, TranslationService as TService } from 'angular-l10n'
import { PubSubService } from 'angular2-pubsub'

import { AlertController } from '../../../../services/alert/app.alert'
import { InventoryService } from '../../../../services/app.inventory'
import { SuperInventoryAddItemComponent } from '../../super-inventory/super.inventory.add.item'

@Component({
  selector: '[gmp-packing-hand-washing-add-item]',
  templateUrl: './gmp.packing.hand.washing.add.item.html'
})

export class GMPPackingHandWashingAddItemComponent extends SuperInventoryAddItemComponent implements OnInit {
  @Language() private lang: string
  newItem: FormGroup = new FormBuilder().group({})

  constructor(alertCtrl: AlertController, ts: TService, _fb: FormBuilder, inventoryService: InventoryService, events: PubSubService) {
    super(_fb, alertCtrl, ts, inventoryService, events)
  }

  public ngOnInit(): void {
    this.setSuffix("gmp-packing-hand-washing")
    this.createItemForm({
      name: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    })
  }

  public addItem(): void {
    let data = { item: { id: 0, is_active: 1, name: this.newItem.value.name, position: 0 } }
    let itemData = { name: this.newItem.value.name }
    super.addItem(data, itemData)
  }
}