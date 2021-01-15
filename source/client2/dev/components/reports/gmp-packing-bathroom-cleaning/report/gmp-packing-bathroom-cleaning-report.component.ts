import { Component, Input, ViewChild } from '@angular/core'
import { Language, TranslationService } from 'angular-l10n'

import { SuperReportComponent } from '../../super-report/super.report'
import { Report } from '../interfaces/gmp-packing-bathroom-cleaning-report.interface'

@Component({
  selector: 'gmp-packing-bathroom-cleaning-report',
  templateUrl: './gmp-packing-bathroom-cleaning-report.component.html'
})

export class GMPPackingBathroomCleaningReportComponent extends SuperReportComponent {
  @Input() report: Report
  @Language() lang: string
  @ViewChild('report_body') reportHTML: any

  constructor(translationService: TranslationService) {
    super(translationService)
  }

  public getCSS(appendCSS?: string): string {
    return '<style>' + this.commonCSS() + ((appendCSS === String(appendCSS)) ? appendCSS : '') + '.dateColumn{width:80px}.timeColumn{width:40px}.initialsColumn{width:70px}.questionColumn{width:279px}.answerColumn{width:80px}.activityColumn{width:80px}</style>'
  }
}