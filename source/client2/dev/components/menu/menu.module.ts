import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { UIRouterModule } from '@uirouter/angular'
import { LocalizationModule } from 'angular-l10n'
import { MaterializeModule } from 'ngx-materialize'

import { MenuAuditListComponent } from './audit-list/menu-audit-list.component'
import { MenuAuditComponent } from './audit/menu-audit.component'
import { MenuComponent } from './viewer/menu-viewer.component'

const menuState = { name: 'menu', url: '/menu/*path', component: MenuComponent }
const auditState = { name: 'menu-audit', url: '/menu-audit/:user_id/*path', component: MenuAuditComponent }
const listState = { name: 'menu-audit-list', url: '/menu-audit-list', component: MenuAuditListComponent }

@NgModule({
  imports: [
    LocalizationModule,
    ReactiveFormsModule,
    MaterializeModule,
    UIRouterModule.forChild({ states: [ menuState, auditState, listState ] }),
    CommonModule
  ],
  declarations: [
    MenuComponent,
    MenuAuditComponent,
    MenuAuditListComponent
  ],
  exports: [
    MenuComponent,
    MenuAuditComponent,
    MenuAuditListComponent
  ]
})

export class MenuModule { }