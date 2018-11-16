import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Language } from 'angular-l10n'

import { MenuService } from '../../../services/app.menu'
import { DashboardDirectory, DashboardFile, DashboardLink } from '../menu.interface'
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'menu-audit.component.html',
  selector: 'menu-audit'
})

export class MenuAuditComponent implements OnInit {
  @Language() lang: string
  currentDirectory: Array<DashboardDirectory | DashboardLink | DashboardFile> = []
  parentDirectoryID: number = null
  directories: Array<string> = []
  breadcrumbs: Array<string> = []
  errorDirectory: boolean = false
  errorNetwork: boolean = false
  loadingDirectory: boolean = true
  serverDirectory: Array<DashboardDirectory | DashboardLink | DashboardFile> = null
  path: string = null
  user_id: number = null
  initSubscription: Subscription = null
  getMenuSuccessSubscription: Subscription = null
  setPathSubscription: Subscription = null
  
  json: string = ''

  constructor(private routeState: ActivatedRoute, private menuService: MenuService) {

  }

  public ngOnInit(): void {
    if (this.serverDirectory == null) {
      if (this.initSubscription != null) {
        this.initSubscription.unsubscribe()
      }

      this.initSubscription = this.routeState.paramMap.subscribe((params) => {
        this.user_id = Number(params.get('user_id'))
        this.getMenu(this.user_id)
      })
    } else {
      this.getMenuSuccess()
    }
  }

  public getMenu(userID: number): void {
    this.menuService.getMenu(userID).then(success => {
      this.json = JSON.stringify(success)
      this.serverDirectory = success.menu
      this.getMenuSuccess()
    }, error => {
      this.getMenuError()
    })
  }

  public getMenuSuccess(): void {
    if (this.getMenuSuccessSubscription != null) {
      this.getMenuSuccessSubscription.unsubscribe()
    }

    this.getMenuSuccessSubscription = this.routeState.queryParamMap.subscribe((params) => {
      if (params.get('path') !== undefined && params.get('path') !== null) {
        this.path = params.get('path')
      } else {
        this.path = ''
      }
      this.errorNetwork = false
      this.loadingDirectory = false
      if (this.path === '') {
        this.currentDirectory = this.serverDirectory
        this.parentDirectoryID = null
      } else {
        this.currentDirectory = this.serverDirectory
        this.setPath()
        let accumulatedDirectory = ''
        let matches = 0
        for (let directory of this.directories) {
          accumulatedDirectory += directory
          this.breadcrumbs.push(accumulatedDirectory)
          accumulatedDirectory += '/'
          for (let icon in this.currentDirectory) {
            if (this.currentDirectory[icon].name == directory) {
              matches++
              this.parentDirectoryID = this.currentDirectory[icon].id
              this.currentDirectory = (<DashboardDirectory>this.currentDirectory[icon]).children
              break
            }
          }
        }

        if (matches != this.directories.length) {
          this.currentDirectory = []
          this.errorDirectory = true
        } else {
          this.errorDirectory = false
        }
      }
    })
  }

  public getMenuError(): void {
    this.setPath()
    this.loadingDirectory = false
    this.errorNetwork = true
  }

  public setPath(): void {
    if (this.setPathSubscription != null) {
      this.setPathSubscription.unsubscribe()
    }

    this.setPathSubscription = this.routeState.queryParamMap.subscribe((params) => {
      let path: string = params.get('path')
      if (path != null) {
        this.directories = path.split('/')
      } else {
        this.directories = []
      }
    })
  }

  public ngOnDestroy(): void {
    if (this.getMenuSuccessSubscription != null) {
      this.getMenuSuccessSubscription.unsubscribe()
    }
    if (this.setPathSubscription != null) {
      this.setPathSubscription.unsubscribe()
    }
  }
}