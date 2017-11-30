import { Component, Input, NgModule } from '@angular/core'
import { Storage } from '@ionic/storage'

import { Language } from 'angular-l10n'

import { FormGroup } from '@angular/forms'

import { LogItem } from '../interfaces/gmp.packing.glass.brittle.log.interface'

@Component({
    selector: 'gmp-packing-glass-brittle-item',
    templateUrl: './gmp.packing.glass.brittle.item.html'
})

export class GMPPackingGlassBrittleItemComponent {
    @Input()
    item: LogItem

    @Input('itemGroup')
    public itemForm: FormGroup

    @Language()
    lang: string

    constructor(private storage: Storage) {
        
    }
}