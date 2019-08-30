import { Injectable } from '@angular/core'
import { TranslationService } from 'angular-l10n'
import { Observable } from 'rxjs'

import { AlertController } from './alert/app.alert'
import { BackendService } from './app.backend'
import { FlattenService } from './flatten.service'
import { LoaderService } from './loader.service'
import { ToastsService } from './toasts.service'

export interface TranslateKeyData {
  key: string,
  args?: { [key: string]: string }
}

@Injectable()
export class BackendAPIService {
  constructor(private server: BackendService,
    private loaderService: LoaderService,
    private flattenService: FlattenService,
    private toastService: ToastsService,
    private alertCtrl: AlertController,
    private translationService: TranslationService) {

  }

  public service(service: string, data?: Object, showOnSuccess: boolean = true): Promise<any> {
    if (service === String(service)) {
      let promise = new Promise<any>((resolve, reject) => {
        let loader = this.loaderService.koiLoader()

        this.server.update(
          service,
          (data !== undefined && data !== null) ? this.flattenService.formDataFromFlatObject(this.flattenService.flatten(data)) : new FormData(),
          (response: any) => {
            this.toastService.showServerMessage(service, response.meta.return_code, showOnSuccess)
            loader.dismiss()
            if (response.meta.return_code == 0) {
              resolve(response.data)
            } else {
              reject(response.meta.return_code)
            }
          }, (error: any, caught: Observable<void>) => {
            this.toastService.showClientMessage('server-unreachable', 1, showOnSuccess)
            loader.dismiss()
            reject('network error')
            return []
          }
        )
      })

      return promise
    }

    return null
  }

  public backgroundService(service: string, data?: Object, showOnSuccess: boolean = true): Promise<any> {
    if (service === String(service)) {
      let promise = new Promise<any>((resolve, reject) => {
        this.server.update(
          service,
          (data !== undefined && data !== null) ? this.flattenService.formDataFromFlatObject(this.flattenService.flatten(data)) : new FormData(),
          (response: any) => {
            this.toastService.showServerMessage(service, response.meta.return_code, showOnSuccess)
            if (response.meta.return_code == 0) {
              resolve(response.data)
            } else {
              reject(response.meta.return_code)
            }
          }, (error: any, caught: Observable<void>) => {
            this.toastService.showClientMessage('server-unreachable', 1, showOnSuccess)
            reject('network error')
            return []
          }
        )
      })

      return promise
    }

    return null
  }

  public silentService(service: string, data?: Object): Promise<any> {
    if (service === String(service)) {
      let promise = new Promise<any>((resolve, reject) => {
        this.server.update(
          service,
          (data !== undefined && data !== null) ? this.flattenService.formDataFromFlatObject(this.flattenService.flatten(data)) : new FormData(),
          (response: any) => {
            if (response.meta.return_code == 0) {
              resolve(response.data)
            } else {
              reject(response.meta.return_code)
            }
          }, (error: any, caught: Observable<void>) => {
            reject('network error')
            return []
          }
        )
      })

      return promise
    }

    return null
  }

  public confirmationService(service: string, title: TranslateKeyData, message: TranslateKeyData, data?: Object, showOnSuccess: boolean = true): Promise<any> {
    if (service === String(service)) {
      let promise = new Promise<any>((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: this.translationService.translate(title.key, title.args),
          message: this.translationService.translate(message.key, message.args),
          buttons: [
            {
              text: this.translationService.translate('Options.cancel'),
              handler: () => {
                reject('user_cancel')
              }
            },
            {
              text: this.translationService.translate('Options.accept'),
              handler: () => {
                this.service(service, data, showOnSuccess).then(success => {
                  resolve(success)
                }, error => {
                  reject(error)
                })
              }
            }
          ]
        })
      })

      return promise
    }

    return null
  }
}