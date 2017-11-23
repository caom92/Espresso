import { Component, Input, NgModule, OnInit } from '@angular/core'
import { NavParams } from 'ionic-angular'
import { DatePipe } from '@angular/common'

import { Language } from 'angular-l10n'

import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { CaptureLog, CaptureItem } from '../interfaces/gmp.packing.thermo.calibration.capture.interface'
import { Log, LogItem } from '../interfaces/gmp.packing.thermo.calibration.log.interface'
//import { LogHeaderComponent } from '../components/app.log.header'

import { DateTimeService } from '../../../../services/app.time'
import { BackendService } from '../../../../services/app.backend'
import { TranslationService } from '../../../../services/app.translation'
import { ToastService } from '../../../../services/app.toasts'

@Component({
    selector: 'gmp-packing-thermo-calibration-log',
    templateUrl: './gmp.packing.thermo.calibration.log.html',
    providers: [
        BackendService,
        TranslationService,
        ToastService
    ]
})

export class GMPPackingThermoCalibrationLogComponent implements OnInit {
    @Input()
    log: Log = { zone_name: null, program_name: null, module_name: null, log_name: null, html_footer: null, items: [{id: null, name: null, position: null}] }

    @Language()
    lang: string

    public gmpPackingThermoCalibrationForm: FormGroup = new FormBuilder().group({})

    constructor(private _fb: FormBuilder, private timeService: DateTimeService, private server: BackendService, private translationService: TranslationService, private toasts: ToastService, private navParams: NavParams){
        this.log = navParams.get('data');
        console.log(this.log)
    }

    ngOnInit(){
        let currentTime = this.timeService.getISOTime(new Date())
        this.gmpPackingThermoCalibrationForm = this._fb.group({
            date: [this.timeService.getISODate(new Date()), [Validators.required, Validators.minLength(1)]],
            time: [currentTime, [Validators.required]],
            items: this._fb.array([])
        })
        const control = <FormArray>this.gmpPackingThermoCalibrationForm.controls['items'];
        for (let item of this.log.items) {
            control.push(this.initItem({id:item.id,test:null,calibration:false,sanitization:false,deficiencies:"",corrective_action:""}))
        }
    }

    ngOnChanges(){
        this.ngOnInit()
    }

    initItem(item: CaptureItem){
        return this._fb.group({
            id:[item.id, [Validators.required]],
            test:[item.test, [Validators.required]],
            calibration:[item.calibration],
            sanitization:[item.sanitization],
            deficiencies:[item.deficiencies],
            corrective_action:[item.corrective_action]
        })
    }

    save(model: CaptureLog){
        if(this.gmpPackingThermoCalibrationForm.valid){
            this.toasts.showText("capturedLog")
            let form_data = new FormData()
            let filled_log = this.gmpPackingThermoCalibrationForm.value
            
            let flatObj = this.flatten(filled_log)

            for ( let key in flatObj ) {
                let tempKey = key + "]"
                tempKey = tempKey.replace(']', '')
                if(flatObj[key] == true){
                    form_data.append(tempKey, "1")
                } else if(flatObj[key] == false){
                    form_data.append(tempKey, "0")
                } else {
                    form_data.append(tempKey, flatObj[key])
                }
            }

            console.log(this.gmpPackingThermoCalibrationForm.value)
            console.log(flatObj)
    
            this.server.update(
                'capture-gmp-packing-thermo-calibration',
                form_data,
                (response: any) => {
                  console.log(response)
                  console.log(JSON.stringify(response))
                } // (response: any)
            ) // this.server.update
        } else {
            this.toasts.showText("incompleteLog")
        }
    }

    flatten(data) {
        var result = {}
    
        function recurse(cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur
            } else if (Array.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + "][" + i + "][")
                if (l == 0) result[prop] = []
            } else {
                var isEmpty = true
                for (var p in cur) {
                    isEmpty = false
                    recurse(cur[p], prop ? prop + p : p)
                }
                if (isEmpty && prop) result[prop] = {}
            }
        }
        
        recurse(data, "")
        return result
    }
}