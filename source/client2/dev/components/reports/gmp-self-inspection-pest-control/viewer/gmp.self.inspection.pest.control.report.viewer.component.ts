import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { BackendService } from '../../../../services/app.backend'
import { LoaderService } from '../../../../services/app.loaders'
import { ToastsService } from '../../../../services/app.toasts'
import { SuperReportViewer } from '../../super-report/super.report.viewer'

@Component({
  selector: 'gmp-self-inspection-pest-control-report-viewer',
  templateUrl: 'gmp.self.inspection.pest.control.report.viewer.component.html'
})

export class GMPSelfInspectionPestControlReportViewerComponent extends SuperReportViewer {
  constructor(routeState: ActivatedRoute,
    server: BackendService,
    formBuilder: FormBuilder,
    loaderService: LoaderService,
    toastService: ToastsService) {
    super(routeState, server, formBuilder, loaderService, toastService)
  }
}