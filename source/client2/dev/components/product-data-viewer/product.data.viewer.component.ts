import { Component, OnInit, ViewChild } from '@angular/core'
import { DefaultLocale, Language } from 'angular-l10n'
import { saveAs } from 'file-saver'
import { MzCollapsibleComponent } from 'ng2-materialize'
import { PapaParseService } from 'ngx-papaparse'

import { LanguageService } from '../../services/app.language'
import { LoaderService } from '../../services/app.loaders'
import { TextAutocomplete } from './product.data.viewer.autocomplete.interface'

@Component({
  selector: 'product-data-viewer',
  templateUrl: 'product.data.viewer.component.html'
})

export class ProductDataViewerComponent implements OnInit {
  @Language() lang: string
  @DefaultLocale() defaultLocale: string
  private data: Array<any> = []
  private filteredData: Array<any> = []
  private currentData: Array<any> = []

  private allLots: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteLots: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allProducts: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteProducts: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allVarieties: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteVarieties: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allBatches: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteBatches: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allTraceability: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteTraceability: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allParcels: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteParcels: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allZones: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteZones: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }

  private allKeys: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  private autocompleteKeys: TextAutocomplete = { data: {}, limit: 5, current: null, count: 0, arr: [] }
  
  private readonly pageSize: number = 50
  private currentPage: number = 0
  private totalReceived: number = 0
  private totalPacked: number = 0
  private startInit: string = ''
  private endInit: string = ''
  private startDate: string = ''
  private endDate: string = ''
  private startFile: string = ''
  private endFile: string = ''
  private startTemp: string = ''
  private endTemp: string = ''
  private noFilters: boolean = true
  private showDetailedView: boolean = null

  @ViewChild('collapsible') collapsible: MzCollapsibleComponent

  private datePickerConfig: Pickadate.DateOptions = {
    closeOnSelect: true,
    closeOnClear: false,
    monthsFull: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
      'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthsShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep',
      'Oct', 'Nov', 'Dec'
    ],
    weekdaysFull: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
      'Sábado'
    ],
    weekdaysShort: [
      'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
    ],
    weekdaysLetter: [
      'D', 'L', 'M', 'R', 'J', 'V', 'S'
    ],
    onOpen: () => {
      this.startTemp = this.startDate
      this.endTemp = this.endDate
    },
    onClose: () => {
      if (this.startDate != this.startTemp && new Date(this.startDate) > new Date(this.endDate))
        this.startDate = String(this.endDate)
      if (this.endDate != this.endTemp && new Date(this.endDate) < new Date(this.startDate))
        this.endDate = String(this.startDate)
      //this.filter()
    },
    today: 'Hoy',
    clear: 'Borrar',
    close: 'Cerrar',
    format: 'dddd, dd mmmm, yyyy',
    formatSubmit: "m/d/yyyy",
    selectYears: true,
    selectMonths: true
  }

  constructor(private csvParse: PapaParseService, private loaderService: LoaderService, private langManager: LanguageService) {
    
  }

  public ngOnInit(): void {
    if (localStorage.role_name == 'Director') {
      this.allKeys.current = null
    } else if (localStorage.role_name == 'Supervisor') {
      this.allKeys.current = localStorage.zone_name
    } else if (localStorage.role_name == 'Manager') {
      this.allZones.current = localStorage.zone_name
    } else {
      this.allKeys.current = 'not valid'
    }

    let loader = this.loaderService.koiLoader()
    this.csvParse.parse(`http://localhost/espresso/source/server/bcn_database.php`, {
      complete: (results, file) => {        
        if (this.allKeys.current != null && this.allKeys.current != '') {
          for (let d of results.data) {
            if (this.allKeys.current == d['Clave']) {
              this.data.push(d)
              this.filteredData.push(d)
            }
          }
        } else if (this.allZones.current != null && this.allZones.current != '') {
          for (let d of results.data) {
            if (this.allZones.current == d['Zona']) {
              this.data.push(d)
              this.filteredData.push(d)
            }
          }
        } else {
          this.data = results.data
          this.filteredData = results.data
        }

        //this.filter()

        this.populateFilters()

        loader.dismiss()
      },
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    })
  }

  public onAutocompleteChange(event: any, autocomplete: any): void {
    if (autocomplete.data[event.target.value] === undefined) {
      event.target.value = ''
    }
    
    autocomplete.current = event.target.value

    this.showDetailedView = null
    this.noFilters = true

    this.filter()
  }

  public nextPage(): void {
    if((this.currentPage + 1) * this.pageSize < this.filteredData.length) {
      this.currentPage++
      this.currentData = []
      for (let i = this.currentPage * this.pageSize; i < (this.currentPage + 1) * this.pageSize && i < this.filteredData.length; i++) {
        this.currentData.push(this.filteredData[i])
      }
    }
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--
      this.currentData = []
      for (let i = this.currentPage * this.pageSize; i < (this.currentPage + 1) * this.pageSize && i < this.filteredData.length; i++) {
        this.currentData.push(this.filteredData[i])
      }
    }
  }

  public goToFirst(): void {    
    this.currentPage = 0
    this.currentData = []
    for (let i = this.currentPage * this.pageSize; i < (this.currentPage + 1) * this.pageSize && i < this.filteredData.length; i++) {
      this.currentData.push(this.filteredData[i])
    }
  }

  public goToLast(): void {
    this.currentPage = Math.ceil(this.filteredData.length / this.pageSize) - 1
    this.currentData = []
    for (let i = this.currentPage * this.pageSize; i < (this.currentPage + 1) * this.pageSize && i < this.filteredData.length; i++) {
      this.currentData.push(this.filteredData[i])
    }
  }

  public formatDate(date: string): Date {
    let formattedDate = new Date(date.replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3"))
    return formattedDate
  }

  public exportCSV(): void {
    saveAs(new Blob([this.csvParse.unparse(this.filteredData)], { type: 'text' }), 'bcn_database.csv')
  }

  public cleanFilters() {
    this.autocompleteKeys.current = ''
    this.autocompleteProducts.current = ''
    this.autocompleteLots.current = ''
    this.autocompleteVarieties.current = ''
    this.autocompleteBatches.current = ''
    this.autocompleteTraceability.current = ''
    this.autocompleteParcels.current = ''
    this.autocompleteZones.current = ''

    if (localStorage.role_name == 'Director') {
      this.allKeys.current = ''
    } else if (localStorage.role_name == 'Supervisor') {
      this.allKeys.current = localStorage.zone_name
    } else if (localStorage.role_name == 'Manager') {
      this.allZones.current = localStorage.zone_name
    } else {
      this.allKeys.current = 'not valid'
    }

    this.startDate = this.startFile
    this.endDate = this.endFile

    this.noFilters = true

    this.showDetailedView = null

    this.totalReceived = 0
    this.totalPacked = 0
    
    this.filter()
  }

  public populateFilters() {
    console.log('populate filters')
    let minFilteredDate = null
    let maxFilteredDate = null

    for (let f of this.filteredData) {
      let registerDate = new Date(f['Fecha'].replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3"))
      if (minFilteredDate == null || new Date(minFilteredDate) >= registerDate) {
        minFilteredDate = f['Fecha'].replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3")
      }

      if (maxFilteredDate == null || new Date(maxFilteredDate) <= registerDate) {
        maxFilteredDate = f['Fecha'].replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3")
      }

      if (this.allLots.data[f['Lote']] === undefined) {
        if (f['Lote'] !== null) {
          this.allLots.data[f['Lote']] = null
          this.allLots.arr.push(f['Lote'])
          this.allLots.count++
        }
      }

      if (this.allProducts.data[f['Producto']] === undefined) {
        if (f['Producto'] !== null) {
          this.allProducts.data[f['Producto']] = null
          this.allProducts.arr.push(f['Producto'])
          this.allProducts.count++
        }
      }

      if (this.allVarieties.data[f['Variedad']] === undefined) {
        if (f['Variedad'] !== null) {
          this.allVarieties.data[f['Variedad']] = null
          this.allVarieties.arr.push(f['Variedad'])
          this.allVarieties.count++
        }
      }

      if (this.allBatches.data[f['Batch']] === undefined) {
        if (f['Batch'] !== null) {
          this.allBatches.data[f['Batch']] = null
          this.allBatches.count++
        }
      }

      if (this.allTraceability.data[f['Trazabilidad']] === undefined) {
        if (f['Trazabilidad'] !== null) {
          this.allTraceability.data[f['Trazabilidad']] = null
          this.allTraceability.count++
        }
      }

      if (this.allParcels.data[f['Parcela']] === undefined) {
        if (f['Parcela'] !== null) {
          this.allParcels.data[f['Parcela']] = null
          this.allParcels.arr.push(f['Parcela'])
          this.allParcels.count++
        }
      }

      if (this.allZones.data[f['Zona']] === undefined) {
        if (f['Zona'] !== null) {
          this.allZones.data[f['Zona']] = null
          this.allZones.arr.push(f['Zona'])
          this.allZones.count++
        }
      }

      if (this.allKeys.data[f['Clave']] === undefined) {
        if (f['Clave'] !== null) {
          this.allKeys.data[f['Clave']] = null
          this.allKeys.arr.push(f['Clave'])
          this.allKeys.count++
        }
      }
    }

    console.log('Zonas', this.allZones.arr.sort().length)
    console.log('Claves', this.allKeys.arr.sort().length)
    console.log('Lotes', this.allLots.arr.sort().length)
    console.log('Parcelas', this.allParcels.arr.sort().length)
    console.log('Productos', this.allProducts.arr.sort().length)
    console.log('Variedades', this.allVarieties.arr.sort().length)
    console.log('Trazabilidad', Object.keys(this.allTraceability.data).length)
    console.log('Batches', Object.keys(this.allBatches.data).length)

    this.autocompleteLots = this.allLots
    this.autocompleteProducts = this.allProducts
    this.autocompleteVarieties = this.allVarieties
    this.autocompleteBatches = this.allBatches
    this.autocompleteTraceability = this.allTraceability
    this.autocompleteParcels = this.allParcels
    this.autocompleteZones = this.allZones
    this.autocompleteKeys = this.allKeys

    if (this.startDate == '' || this.startDate == null) {
      this.startDate = minFilteredDate
      this.startFile = minFilteredDate
    }
      
    if (this.endDate == '' || this.endDate == null) {
      this.endDate = maxFilteredDate
      this.endFile = maxFilteredDate
    }
  }

  public showSummary(): void {
    this.filter()

    this.noFilters = false

    this.showDetailedView = false
    $(this.collapsible.collapsible.nativeElement).collapsible('open', 0)
  }

  public showDetails(): void {
    this.filter()

    this.noFilters = false

    this.showDetailedView = true
    $(this.collapsible.collapsible.nativeElement).collapsible('open', 0)
  }

  public filter(): void {
    this.filteredData = []

    this.totalPacked = 0
    this.totalReceived = 0

    this.currentPage = 0

    for (var key in this.allLots.data) {
      if (this.allLots.data.hasOwnProperty(key)) {
        delete this.allLots.data[key];
      }
    }
    this.allLots.arr = []
    this.allLots.count = 0

    for (var key in this.allProducts.data) {
      if (this.allProducts.data.hasOwnProperty(key)) {
        delete this.allProducts.data[key];
      }
    }
    this.allProducts.arr = []
    this.allProducts.count = 0

    for (var key in this.allVarieties.data) {
      if (this.allVarieties.data.hasOwnProperty(key)) {
        delete this.allVarieties.data[key];
      }
    }
    this.allVarieties.arr = []
    this.allVarieties.count = 0

    for (var key in this.allBatches.data) {
      if (this.allBatches.data.hasOwnProperty(key)) {
        delete this.allBatches.data[key];
      }
    }
    this.allBatches.arr = []
    this.allBatches.count = 0

    for (var key in this.allTraceability.data) {
      if (this.allTraceability.data.hasOwnProperty(key)) {
        delete this.allTraceability.data[key];
      }
    }
    this.allTraceability.arr = []
    this.allTraceability.count = 0

    for (var key in this.allParcels.data) {
      if (this.allParcels.data.hasOwnProperty(key)) {
        delete this.allParcels.data[key];
      }
    }
    this.allParcels.arr = []
    this.allParcels.count = 0

    for (var key in this.allZones.data) {
      if (this.allZones.data.hasOwnProperty(key)) {
        delete this.allZones.data[key];
      }
    }
    this.allZones.arr = []
    this.allZones.count = 0

    for (var key in this.allKeys.data) {
      if (this.allKeys.data.hasOwnProperty(key)) {
        delete this.allKeys.data[key];
      }
    }
    this.allKeys.arr = []
    this.allKeys.count = 0
    
    let minDate = (this.startDate != '') ? new Date(this.startDate) : null
    let maxDate = (this.endDate != '') ? new Date(this.endDate) : null
    
    for (let d of this.data) {
      if ((this.allKeys.current == null || d['Clave'] == this.allKeys.current || this.allKeys.current == '') &&
        (this.allProducts.current == null || d['Producto'] == this.allProducts.current || this.allProducts.current == '') &&
        (this.allLots.current == null || d['Lote'] == this.allLots.current || this.allLots.current == '') &&
        (this.allVarieties.current == null || d['Variedad'] == this.allVarieties.current || this.allVarieties.current == '') &&
        (this.allBatches.current == null || d['Batch'] == this.allBatches.current || this.allBatches.current == '') &&
        (this.allTraceability.current == null || d['Trazabilidad'] == this.allTraceability.current || this.allTraceability.current == '') &&
        (this.allParcels.current == null || d['Parcela'] == this.allParcels.current || this.allParcels.current == '') &&
        (this.allZones.current == null || d['Zona'] == this.allZones.current || this.allZones.current == '')) {
        let registerDate = new Date(d['Fecha'].replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3"))

        if ((minDate == null || minDate <= registerDate) && (maxDate == null || maxDate >= registerDate)) {
          this.filteredData.push(d)
          if (d['Emp'] === Number(d['Emp'])) {
            this.totalPacked += d['Emp']
          }
          if (d['Recibo'] === Number(d['Recibo'])) {
            this.totalReceived += d['Recibo']
          }
        }
      }

      this.currentData = []
      for (let i = this.currentPage * this.pageSize; i < (this.currentPage + 1) * this.pageSize && i < this.filteredData.length; i++) {
        this.currentData.push(this.filteredData[i])
      }
    }

    this.populateFilters()
  }
}