import { EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { DefaultLocale, Language } from 'angular-l10n'

import { LogService } from '../../../services/log.service'
import { Preview } from '../report-common/report-preview/report-preview.interface'
import { ActiveReport, ReportRequest } from '../reports.interface'
import { SuperReportComponent } from './super.report'
import { SuperReportInterface } from './super.report.interface'

export class SuperReportLoader implements OnInit {
  @Language() private lang: string
  @DefaultLocale() defaultLocale: string

  @Input() public report: SuperReportInterface = null
  @Input() private activeReport: ActiveReport
  @Input() private suffix: string
  @Input() private footer: string

  @Output() removed = new EventEmitter<number>()

  @ViewChild('reportContainer') public reportComponent: SuperReportComponent

  private reportRequest: ReportRequest = { lang: null, content: null, style: null, company: null, address: null, logo: null, orientation: null, footer: null, supervisor: null, signature: null, gp_supervisor: null, gp_signature: null, subject: null, fontsize: null, images: null }
  private showReport: boolean = false
  preview: Array<Preview> = null

  readonly dayOptions = { day: 'numeric' }
  readonly monthOptions = { month: 'short' }
  readonly yearOptions = { year: '2-digit' }
  readonly isDirector = localStorage.getItem('role_name') === 'Director'

  constructor(private logService: LogService) {

  }

  public ngOnInit(): void {
    this.preview = this.getPreview()
  }

  public getPreview(): Array<Preview> {
    return null
  }

  public requestPDFReport(): void {
    this.reportRequest = {
      lang: this.lang,
      content: JSON.stringify([this.reportComponent.getPDFContent()]),
      style: this.reportComponent.getCSS(),
      company: localStorage.getItem('company_name'),
      address: localStorage.getItem('company_address'),
      logo: localStorage.getItem('company_logo'),
      orientation: this.reportComponent.getOrientation(),
      footer: this.footer,
      supervisor: this.reportComponent.report.approved_by,
      signature: this.reportComponent.report.signature_path,
      gp_supervisor: this.reportComponent.report.gp_supervisor,
      gp_signature: this.reportComponent.report.gp_signature_path,
      subject: '',
      images: (this.reportComponent.getImages() == '') ? null : this.reportComponent.getImages(),
      fontsize: this.reportComponent.getFontSize()
    }
  }

  public setReportToPending(): void {
    this.logService.retreat(Number(this.report.report_id)).then(success => {
      this.removed.emit(Number(this.report.report_id))
    }, error => {

    })
  }

  public openHTMLReport(): void {
    this.showReport = true
    this.activeReport.id = this.report.report_id
  }

  public closeHTMLReport(): void {
    this.showReport = false
    this.activeReport.id = 'any'
  }
}