import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { LocalizationModule } from 'angular-l10n'
import { MaterializeModule } from 'ngx-materialize'

import { LogCommonModule } from '../log-common/log-common.module'
import { GMPOthersUnusualOccurrenceLogComponent } from './log/gmp.others.unusual.occurrence.log'

@NgModule({
  imports: [
    LocalizationModule,
    ReactiveFormsModule,
    MaterializeModule,
    LogCommonModule,
    CommonModule
  ],
  declarations: [
    GMPOthersUnusualOccurrenceLogComponent
  ],
  exports: [
    GMPOthersUnusualOccurrenceLogComponent
  ]
})

export class GMPOthersUnusualOccurrenceLogModule { }