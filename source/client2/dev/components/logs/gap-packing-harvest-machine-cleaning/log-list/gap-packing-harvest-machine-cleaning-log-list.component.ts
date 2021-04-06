import { Component } from '@angular/core'
import { DefaultLocale, Language } from 'angular-l10n'

import { LogService } from '../../../../services/log.service'
import { SuperLogListComponent } from '../../super-logs/super.logs.list'

@Component({
  selector: 'gap-packing-harvest-machine-cleaning-log-list',
  templateUrl: './gap-packing-harvest-machine-cleaning-log-list.component.html'
})

export class GAPPackingHarvestMachineCleaningLogList extends SuperLogListComponent {
  @Language() lang: string
  @DefaultLocale() defaultLocale: string
  
  constructor(logService: LogService) {
    super(logService)
  }
}