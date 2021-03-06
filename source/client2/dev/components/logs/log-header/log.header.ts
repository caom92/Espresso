import { Component, Input, OnInit } from '@angular/core'
import { Language } from 'angular-l10n'
import { DateTimeService } from '../../../services/app.time'

@Component({
  selector: 'log-header',
  templateUrl: './log.header.html'
})

export class LogHeaderComponent implements OnInit {
  @Input()
  log: {zone_name: string, program_name: string, module_name: string, date: string, created_by: string} = {
    zone_name: null,
    program_name: null,
    module_name: null,
    date: null,
    created_by: null
  }

  date: string = ""
  username: string = ""
  @Language() lang: string

  constructor(private timeService: DateTimeService) {

  }

  ngOnInit() {
    if (this.log.date != null && this.log.date != undefined)
      this.date = this.log.date
    else
      this.date = this.timeService.getISODate(new Date())

    if (this.log.created_by != null && this.log.created_by != undefined){
      this.username = this.log.created_by
    } else {
      this.username = localStorage.user_full_name
    }
  }
}