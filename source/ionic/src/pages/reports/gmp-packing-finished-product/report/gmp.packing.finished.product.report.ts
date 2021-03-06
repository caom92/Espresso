import { Component, Input, ViewChild } from '@angular/core'
import { Language } from 'angular-l10n'

import { SuperReportComponent } from '../../super-report/super.report'
import { Report } from '../interfaces/gmp.packing.finished.product.report.interface'

@Component({
  selector: 'gmp-packing-finished-product-report',
  templateUrl: './gmp.packing.finished.product.report.html'
})

export class GMPPackingFinishedProductReportComponent extends SuperReportComponent {
  @Input() report: Report
  @Language() lang: string
  @ViewChild("report_body") reportHTML: any
  entry = null

  constructor() {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.entry = this.report.entries[0]
  }

  public getOrientation(): string {
    return "L"
  }

  public getFontSize(): string {
    return "8"
  }

  public getCSS(): string {
    return "<style> table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td { border: 1px solid #000000; text-align: left; } th { border: 1px solid #000000; text-align: left; font-weight: bold; background-color: #4CAF50; } .batchColumn { width: 60px; } .areaColumn { width: 60px; } .suppliersColumn { width: 60px; } .productsColumn { width: 60px; } .clientsColumn { width: 60px; } .qualityColumn { width: 60px; } .originColumn{ width: 50px; } .expiresColumn { width: 60px; } .waterColumn { width: 42px; } .packingColumn { width: 52px; } .weightColumn { width: 52px; } .labelColumn { width: 52px; } .traceabilityColumn { width: 52px; } .urlColumn { width: 67px; } .notesColumn { width: 152px; } </style>"
  }
}