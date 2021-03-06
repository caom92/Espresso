import { Component, Input, NgModule, OnInit } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { MaterializeModule } from 'ng2-materialize'

import { FormGroup } from '@angular/forms';

@Component({
    selector: 'gmp-packing-preop-type',
    templateUrl: '../../../../../templates/gmp.packing.preop.type.component.html'
})

export class GMPPackingPreopTypeComponent implements OnInit {
    @Input()
    type: {id: number, name: string, items: Array<{id: number, name: string, order: number}>}

    @Input()
    actions: Array<{name: string}>

    @Input('itemGroup')
    public itemForm: FormGroup;

    ngOnInit (){
        console.log(this.itemForm)
    }
}