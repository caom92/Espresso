import { OnDestroy, OnInit } from '@angular/core'
import { PubSubService } from 'angular2-pubsub'
import { DragulaService } from 'ng2-dragula'
import { Subscription } from 'rxjs/Subscription'

import { AreaManagerService } from '../../../services/app.area.manager'
import { SuperInventoryAreaInterface } from './super.area.inventory.interface'

export class SuperAreaInventoryListComponent implements OnInit, OnDestroy {
  protected drag: Subscription = null
  protected dragend: Subscription = null
  protected bagName: string = null
  protected currentInventory: Array<SuperInventoryAreaInterface> = null
  protected originalInventory: Array<SuperInventoryAreaInterface> = null
  private suffix: string = null

  constructor(protected dragulaService: DragulaService,
    public events: PubSubService,
    protected areaManagerService: AreaManagerService) {

  }

  public setSuffix(suffix: string): void {
    this.suffix = suffix
  }

  public setBagName(name: string): void {
    this.bagName = name
  }

  public setInventory(inventory: Array<SuperInventoryAreaInterface>) {
    this.currentInventory = inventory
  }

  public setOriginalInventory(inventory: Array<SuperInventoryAreaInterface>) {
    this.originalInventory = this.currentInventory.map(x => Object.assign({}, x))
  }

  public ngOnInit(): void {
    // Guardamos el inventario original 
    this.originalInventory = this.currentInventory.map(x => Object.assign({}, x))

    // Activamos las opciones de Dragula; en este caso nos interesa que el
    // elemento se pueda mover solo al hacer click sobre el ícono de la cruz
    // con flechas
    /*this.dragulaService.setOptions(this.bagName, {
      moves: function (el, container, handle) {
        return (handle.classList.contains('handle'))
      },
      revertOnSpill: true
    })*/

    // Al comenzar el desplazamiento de un elemento de inventario, se detiene
    // la posibilidad de realizar scroll
    this.drag = this.dragulaService.drag.subscribe((value) => {
      if (value[0] == this.bagName) {
        this.events.$pub("scroll:stop", "Scroll Stopped")
      }
    })

    // Al terminar el desplazamiento de un elemento de inventario, se habilita
    // la posibilidad de realizar scroll
    this.dragend = this.dragulaService.dragend.subscribe((value) => {
      if (value[0] == this.bagName) {
        this.events.$pub("scroll:start", "Scroll Started")
        let index = 1
        let reorderedItemArray: Array<{ id: number, position: number }> = []

        for (let item in this.currentInventory) {
          this.currentInventory[item].position = index++
          reorderedItemArray.push({
            id: this.currentInventory[item].id,
            position: this.currentInventory[item].position
          })
        }

        this.areaManagerService.reorderAreaInventory(reorderedItemArray, this.suffix).then(success => {
          this.originalInventory = this.currentInventory.map(x => Object.assign({}, x))
        }, error => {
          let temp = this.originalInventory.map(x => Object.assign({}, x))
          for(let index in temp){
            for(let prop in this.currentInventory[index]){
              this.currentInventory[index][prop] = temp[index][prop]
            }
          }
        })
      }
    })
  }

  public ngOnDestroy(): void {
    if (this.dragulaService.find(this.bagName) !== undefined) {
      console.warn("Dragula bag " + this.bagName + " destroyed")
      this.drag.unsubscribe()
      this.dragend.unsubscribe()
      this.dragulaService.destroy(this.bagName)
    } else {
      console.error("No Dragula bag " + this.bagName + " on this inventory lists")
    }
  }
}