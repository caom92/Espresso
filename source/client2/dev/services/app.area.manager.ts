import { Injectable } from '@angular/core'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { TranslationService } from 'angular-l10n'
import { Observable } from 'rxjs/Rx'

import { BackendService } from './app.backend'
import { LoaderService } from './app.loaders'
import { ToastsService } from './app.toasts'

/**
 * Servicio que agrupa las funciones en común que pueden ser utilizadas para el
 * control de áreas, independientemente de la bitácora
 * 
 * @export
 * @class AreaManagerService
 */

@Injectable()
export class AreaManagerService {
  constructor(private loaderService: LoaderService,
    private toastService: ToastsService,
    private server: BackendService,
    public translationService: TranslationService) {

  }

  public getAreaInventory(suffix: string): Promise<any> {
    let areaInventoryPromise = new Promise<any>((resolve, reject) => {
      let loader = this.loaderService.koiLoader()
      
      this.server.update(
        'get-areas-of-zone-' + suffix,
        new FormData(),
        (response: any) => {
          if (response.meta.return_code == 0) {
            if (response.data) {
              resolve(response.data)
              loader.dismiss()
            } else {
              reject('bad request')
              loader.dismiss()
              this.toastService.showText('serverUnreachable')
            }
          } else {
            reject('bad request')
            loader.dismiss()
            this.toastService.showString('Error ' + response.meta.return_code + ', server says: ' + response.meta.message)
          }
        },
        (error: any, caught: Observable<void>) => {
          reject('network error')
          loader.dismiss()
          this.toastService.showText('serverUnreachable')
          return []
        }
      )
    })

    return areaInventoryPromise
  }

  public getAreaInventoryByPosition(suffix: string): Promise<any> {
    let areaInventoryPromise = new Promise<any>((resolve, reject) => {
      let loader = this.loaderService.koiLoader()
      this.server.update(
        'get-areas-of-zone-by-position-' + suffix,
        new FormData(),
        (response: any) => {
          if (response.meta.return_code == 0) {
            if (response.data) {
              resolve(response.data)
              loader.dismiss()
            } else {
              reject('bad request')
              loader.dismiss()
              this.toastService.showText('serverUnreachable')
            }
          } else {
            reject('bad request')
            loader.dismiss()
            this.toastService.showString('Error ' + response.meta.return_code + ', server says: ' + response.meta.message)
          }
        },
        (error: any, caught: Observable<void>) => {
          reject('network error')
          loader.dismiss()
          this.toastService.showText('serverUnreachable')
          return []
        }
      )
    })

    return areaInventoryPromise
  }

  public reorderAreaInventory(data: Array<{ id: number, position: number }>, suffix: string): Promise<any> {
    let reorderPromise = new Promise<any>((resolve, reject) => {
      let loaderReorder = this.loaderService.koiLoader()
      let reorderForm = new FormData()
      let flatData = this.flatten({ items: data })

      for (let key in flatData) {
        reorderForm.append(key, flatData[key])
      }

      this.server.update(
        'reorder-area-' + suffix,
        reorderForm,
        (response: any) => {
          if (response.meta.return_code == 0) {
            loaderReorder.dismiss()
            resolve('server')
          } else {
            loaderReorder.dismiss()
            this.toastService.showText('lastActionReverseBadRequest')
            reject(response.meta.return_code)
          }
        }, (error: any, caught: Observable<void>) => {
          loaderReorder.dismiss()
          this.toastService.showText('lastActionReverseNetwork')
          reject('network error')
          return []
        }
      )
    })

    return reorderPromise
  }

  public addArea(data: any, suffix: string): Promise<any> {
    let addPromise = new Promise<any>((resolve, reject) => {
      let loaderAdd = this.loaderService.koiLoader()
      let itemForm = new FormData()
      let flatData = this.flatten(data)


      for (let key in flatData) {
        itemForm.append(key, flatData[key])
      }

      this.server.update(
        'add-workplace-area-' + suffix,
        itemForm,
        (response: any) => {
          if (response.meta.return_code == 0) {
            loaderAdd.dismiss()
            this.toastService.showText('areaAddSuccess')
            resolve(response.data)
          } else {
            loaderAdd.dismiss()
            this.toastService.showText('badRequest')
            reject(response.meta.return_code)
          }
        },
        (error: any, caught: Observable<void>) => {
          loaderAdd.dismiss()
          reject('network error')
          this.toastService.showText('serverUnreachable')
          return []
        }
      )
    })

    return addPromise
  }

  public editArea(data: any, suffix: string): Promise<any> {
    let editPromise = new Promise<any>((resolve, reject) => {
      let loaderEdit = this.loaderService.koiLoader()
      let editForm = new FormData()
      let flatData = this.flatten(data)


      for (let key in flatData) {
        editForm.append(key, flatData[key])
      }

      this.server.update(
        'edit-workplace-area-' + suffix,
        editForm,
        (response: any) => {
          if (response.meta.return_code == 0) {
            loaderEdit.dismiss()
            this.toastService.showText('areaEditSuccess')
            resolve(response.data)
          } else {
            loaderEdit.dismiss()
            reject(response.meta.return_code)
            //this.toastService.showText('badRequest')
            this.toastService.showString(response.meta.message)
          }
        },
        (error: any, caught: Observable<void>) => {
          loaderEdit.dismiss()
          reject('network error')
          this.toastService.showText('serverUnreachable')
          return []
        }
      )
    })

    return editPromise
  }

  public toggleArea(data: any, suffix: string): Promise<void> {
    let togglePromise = new Promise<any>((resolve, reject) => {
      let loaderToggle = this.loaderService.koiLoader()
      let item = new FormData()
      item.append('id', String(data.id))
      loaderToggle.present()
      this.server.update(
        'toggle-area-' + suffix,
        item,
        (response: any) => {
          if (response.meta.return_code == 0) {
            if (data.is_active == 0) {
              this.toastService.showText('itemChargeSuccess')
              data.is_active = 1
            } else {
              this.toastService.showText('itemDischargeSuccess')
              data.is_active = 0
            }
            resolve()
            loaderToggle.dismiss()
          } else {
            reject()
            this.toastService.showText('lastActionReverseBadRequest')
            loaderToggle.dismiss()
          }
        },
        (error: any, caught: Observable<void>) => {
          reject()
          this.toastService.showText('serverUnreachable')
          loaderToggle.dismiss()
          return []
        }
      )
    })

    return togglePromise
  }

  // https://stackoverflow.com/questions/43551221/angular-2-mark-nested-formbuilder-as-touched
  public setAsDirty(group: FormGroup | FormArray): void {
    group.markAsDirty()
    for (let i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].markAsDirty()
      } else {
        this.setAsDirty(group.controls[i])
      }
    }
  }

  /**
   * @function flatten
   * 
   * Aplana un objeto de cualquier profundidad para darle un formato adecuado
   * para usarse con Form Data y recibirlo en el servidor
   * 
   * @private
   * @param {*} data - Objeto que debe ser convertido a un formato utilizable
   * por el servidor al recibir un Form Data
   * @returns {Object} 
   * @memberof InventoryService
   */

  private flatten(data: any): Object {
    let result = {}

    function recurse(value, key) {
      if (Object(value) !== value) {
        result[key] = value
      } else if (Array.isArray(value)) {
        for (var i = 0, l = value.length; i < l; i++)
          recurse(value[i], key + '[' + i + ']')
        if (l == 0) result[key] = []
      } else {
        var isEmpty = true
        for (var k in value) {
          isEmpty = false
          recurse(value[k], key ? key + '[' + k + ']' : k)
        }
        if (isEmpty && key) result[key] = {}
      }
    }

    if (Object(data) !== data) {
      throw Error('Non-object parameter can\'t be flattened')
    } else {
      recurse(data, '')
    }

    return result
  }
}