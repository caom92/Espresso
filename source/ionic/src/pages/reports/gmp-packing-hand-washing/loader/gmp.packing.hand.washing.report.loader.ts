import { Component, Input, NgModule } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { Events } from 'ionic-angular'

import { Language } from 'angular-l10n'

import { Report } from '../interfaces/gmp.packing.hand.washing.report.interface'

import { GMPPackingHandWashingReportComponent } from '../report/gmp.packing.hand.washing.report'

@Component({
    selector: 'gmp-packing-hand-washing-report-loader',
    templateUrl: './gmp.packing.hand.washing.report.loader.html'
})

export class GMPPackingHandWashingReportLoader {
    @Input()
    report: Report = null

    @Input()
    activeReport: string = "any"

    @Language()
    lang: string

    showReport: boolean = false

    constructor(public events: Events) {
        events.subscribe("reportEvent", (activeReport, time) => {
            this.activeReport = activeReport
            console.log("reporte activo: " + activeReport)
        })
    }

    openHTMLReport(){
        this.showReport = true
        this.events.publish('reportEvent', this.report.report_id, Date.now());
    }

    closeHTMLReport(){
        this.showReport = false
        this.events.publish('reportEvent', "any", Date.now());
    }
}