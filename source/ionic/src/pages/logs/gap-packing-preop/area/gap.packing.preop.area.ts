import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Language } from 'angular-l10n'
import { TranslationService } from '../../../../services/app.translation'
import { LogArea, CorrectiveAction } from '../interfaces/gap.packing.preop.log.interface'

@Component({
  selector: 'gap-packing-preop-area',
  templateUrl: './gap.packing.preop.area.html'
})

export class GAPPackingPreopAreaComponent {
  @Input() area: LogArea
  @Input() actions: Array<CorrectiveAction>
  @Input('group') public areaForm: FormGroup
  @Language() lang: string

  constructor() {

  }
}