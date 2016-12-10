function createDatePicker(){
    $("#report_date_start").html("");
    //$("#report_date_end").html("");
    $("#report_date_start").append('<input id="start_date" type="date" class="datepicker"><label id="start_date_label" class="select_start_date active" for="start_date"></label>');
    $("#start_date").pickadate(datePicker("start_hidden", new Date(), new Date("2016-10-01T00:00:00")));
    //$("#report_date_end").append('<input id="end_date" type="date" class="datepicker"><label id="end_date_label" class="select_end_date active" for="end_date"></label>');
    //$("#end_date").pickadate(datePicker("end_hidden", new Date(), new Date("2016-10-01T00:00:00")));
}

function isDateValid(startDate, endDate){

}

$(function (){
    // First we change the title to that of the current 
    $('ul.tabs').tabs();
    $('.indicator').addClass("green");
    createDatePicker();

    $server.request({
        service: 'get-items-of-zone',
        success: function(response) {
            if (response.meta.return_code == 0) {
                console.log(response.data);
                loadLogForm("SSOP", response.data);
                changeLanguage(localStorage.defaultLanguage);
                $('select').material_select();
            } else {
                throw response.meta.message;
            }
        }
    });

    $("#request_report").click(function(){
        loadSSOPReport($("input[name='start_hidden']").val());
    });

    // We load the tabs; we have 2 or 3 depending on the privileges of the user
    // Read means we can load the PDF manual and see past logs
    // Write means we can read and also submit a new log with the current date
});


function loadLogForm(type, data){
    // With type we will know which functions to call, with data we will know what to display
    functionArray[type](data);
}

// Function array

var functionArray = [];

functionArray["SSOP"] = SSOPPreOperative;

// SSOP Pre Operation Functions

function SSOPPreOperative(data){
    var wrapper = $("<div>");
    $(".log_title").html(data.log_name);
    wrapper.append(logHeader(data.zone_name, data.program_name, data.module_name, data.log_name, getISODate(new Date), localStorage.first_name + " " + localStorage.last_name));

    for(area of data.areas)
        wrapper.append(SSOPPreOperativeArea(area));

    wrapper.append(sendButton("sendSSOP"));

    $("#logs_tab").append(wrapper);

    // Bind functionality

    $("input[id^='acceptable_']").change(function(){
        if($(this).is(":checked")){
            var tag = $(this).attr("id");
            var id = tag.match(/[0-9]+_[0-9]+/g);
            $("#wrapper_select_" + id[0]).hide(500);
            $("#comment_wrapper_" + id[0]).hide(500);
            console.log("POSSITIVE CHECKED");
        }
    });

    $("input[id^='unacceptable_']").change(function(){
        if($(this).is(":checked")){
            var tag = $(this).attr("id");
            var id = tag.match(/[0-9]+_[0-9]+/g);
            $("#wrapper_select_" + id[0]).show(500);
            $("#comment_wrapper_" + id[0]).show(500);
            console.log("NEGATIVE CHECKED");
        }
    });

    $("#sendSSOP").click(function(){
        if(isSSOPReportValid()){
            sendSSOPReport();
        } else {
            Materialize.toast("Por favor rellene todos los campos", 3000, "rounded");
        }
    });
}

function isSSOPReportValid(){
    // Check for the next things for the report to be considered valid:
    // 1. All radio buttons must have a value
    // 2. If radio buttons are selected to unnaceptable, both corrective action and
    //    comment should be filled
    // 3. If radio buttons are selected to acceptable, corrective action defaults to 1
    //    and comment will be empty

    // First condition, we make sure that the total number of radio button elements is
    // Equal to two times those selected (two times because we can only select one radio)
    // button at a time

    var errors = 0;

    if($("input[name^='radio_']").length == (($("input[id^='acceptable_']:checked").length + $("input[id^='unacceptable_']:checked").length)*2)){
        $("input[id^='acceptable_']").each(function(index){
            // Basically, for each ID in index
            if($("input[name^='radio_" + index + "_']:checked").val() == "false"){
                // If unacceptable is selected we must verify if a corrective action and comment are selected

                // Corrective action selected means there is a value other than null
                if($("select[id^='select_" + index + "_']").val() === null){
                    errors++;
                }

                // Comment must have a length other than zero
                if($("input[id^='comment_" + index + "_']").val().length == 0){
                    errors++;
                }
            }
        });
    } else {
        errors++;
    }

    if(errors == 0) {
        console.log("true part achieved");
        return true;
    } else {
        console.log("Errors: " + errors);
        return false;
    }

}

function SSOPPreOperativeArea(area){
    var areaCard = divWrapper("area_report_" + area.id, "card-panel white");
    var title = cardTitle(null, "card-title", area.name);
    var notesRow = divWrapper(null, "row");
    var sanitationRow = divWrapper(null, "row");

    areaCard.append(title);
    areaCard.append("<br>");
    areaCard.append("<br>");

    for (var type of area.types){
        areaCard.append(SSOPTypeTitle(type.name));
        for (var item of type.items){
            areaCard.append(SSOPPreoperativeItem(item, area.id));
        }
    }
    
    notesRow.append(logTextField("note_wrapper_" + area.id, logTextInput("area_notes_" + area.id, "validate", "text", null), logLabel(null, null, null, "Notas"), "input-field col s12"));
    sanitationRow.append(logTextField("sanitation_wrapper_" + area.id, logTextInput("area_sanitation_" + area.id, "validate", "text", null), logLabel(null, null, null, "Persona a cargo de la sanitizacion"), "input-field col s12"));

    areaCard.append(notesRow);
    areaCard.append(sanitationRow);

    return areaCard;
}

function reportTable(id, classes, header, body, footer){
    var table = $("<table>");

    table.addClass(classes);

    if(id)
        table.attr("id", id);

    table.append(header);
    table.append(body);
    // table.append(footer);

    return table;
}

function reportBody(id, classes, rowsArray){

    var body = $("<tbody>");

    body.addClass(classes);

    if(id)
        body.attr("id", id);

    rowsArray.forEach(function(index){
        body.append(reportRow(id, classes, index));
    });

    return body;
}

function reportFooter(){

}

function reportTitle(id, classes, titleArray){
    // Title Array must be as follows
    // An array of objects with attributes classes and colspan
    // Classes will be the classes added to the <th>
    // colspan will be the number of columns the <th> will span
    // {classes: "class", colspan: 2}

    var header = $("<thead>");
    var headerRow = $("<tr>");

    headerRow.addClass(classes);

    if(id)
        headerRow.attr("id", id);

    titleArray.forEach(function(index){
        var th = $("<th>");
        th.addClass(index.classes);

        if(index.colspan){
            th.attr("colspan", index.colspan);
        }

        headerRow.append(th);
    });

    header.append(headerRow);

    return header;
}

function reportRow(id, classes, columnArray){
    // Column Array must be as follows
    // An array of objects with attributes classes, rowspan and contents
    // Classes will be the classes added to the <td>
    // rowspan will be the rows the <td> will span
    // contents will be the contents to be shown on the <td>
    // {classes: "class", rowspan: 2, contents: "Hello World"}

    var row = $("<tr>");

    row.addClass(classes);

    if(id)
        row.attr("id", id);

    columnArray.forEach(function(column){
        row.append(reportRowColumn(column));
    });

    return row;
}

function reportRowColumn(columnObject){
    // Column Array must be as follows
    // A singlem object with attributes
    // Classes will be the classes added to the <td>
    // rowspan will be the rows the <td> will span
    // contents will be the contents to be shown on the <td>
    // {classes: "class", rowspan: 2, contents: "Hello World"}

    var column = $("<td>");

    column.addClass(columnObject.classes);

    if(columnObject.rowspan)
        column.attr("rowspan", columnObject.rowspan);

    if(columnObject.colspan)
        column.attr("colspan", columnObject.colspan);

    column.append(columnObject.contents);

    return column;
}

function loadSSOPReport(startDate){
    var report = new Object();
    report.date = startDate;

    $server.request({
        service: 'report-gmp-packing-preop',
        data: report,
        success: function(response) {
            if (response.meta.return_code == 0) {
                var wrapper = divWrapper(null, null);
                var reportWrapper = divWrapper(null, "card-panel white");

                var reportData = response.data;

                console.log(reportData);

                wrapper.append(reportHeader(reportData.zone_name, reportData.module_name, reportData.program_name, reportData.log_name, reportData.creation_date, reportData.created_by, reportData.approval_date, reportData.approved_by));

                $("#report_tab").append(wrapper);

                var report = divWrapper(null, null);
                
                var headers = [
                    {"classes":"area_title areaColumn"},
                    {"classes":"time_title timeColumn"},
                    {"classes":"number_title numberColumn"},
                    {"classes":"name_title nameColumn"},
                    {"classes":"status_title statusColumn"},
                    {"classes":"action_title actionColumn"},
                    {"classes":"comment_title commentColumn"}
                ];

                var reportContents = new Array(); // Type Row Array

                reportData.areas.forEach(function(index){
                    // We must convert accordingly
                    /* 
                    Column {classes: "something", rowspan: 1, contents: "Anything"}
                    Row [{classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}]
                    Row Array 
                    [
                        [{classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}],
                        [{classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}],
                        [{classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}, {classes: "something", rowspan: 1, contents: "Anything"}]
                    ]
                    */

                    var isFirst = true;

                    var firstRow = new Array(); // Type Row

                    firstRow.push({rowspan: index.items.length + 2, contents: index.area_name, classes: "areaColumn"});
                    firstRow.push({rowspan: index.items.length + 2, contents: index.time, classes: "timeColumn"});

                    index.items.forEach(function(item){
                        if (isFirst) {
                            firstRow.push({contents: item.item_order, classes: "numberColumn"});
                            firstRow.push({contents: item.item_name, classes: "nameColumn"});

                            if(item.item_status == 1){
                                firstRow.push({classes: "acceptable_tag statusColumn"});
                            } else {
                                firstRow.push({classes: "unacceptable_tag statusColumn"});
                            }

                            firstRow.push({contents: item.item_corrective_action, classes: "actionColumn"});
                            firstRow.push({contents: item.item_comments, classes: "commentColumn"});
                            reportContents.push(firstRow);
                            isFirst = false;
                        } else {
                            var tempRow = new Array();

                            tempRow.push({contents: item.item_order, classes: "numberColumn"});
                            tempRow.push({contents: item.item_name, classes: "nameColumn"});

                            if(item.item_status == 1){
                                tempRow.push({classes: "acceptable_tag statusColumn"});
                            } else {
                                tempRow.push({classes: "unacceptable_tag statusColumn"});
                            }

                            tempRow.push({contents: item.item_corrective_action, classes: "actionColumn"});
                            tempRow.push({contents: item.item_comments, classes: "commentColumn"});

                            reportContents.push(tempRow);
                        }
                    });

                    var notesRow = new Array();
                    var personRow = new Array();

                    notesRow.push({colspan: headers.length - 1, contents: "<span class='bold notes_title'></span>: " + index.notes, classes: "fullColumn"});
                    personRow.push({colspan: headers.length - 1, contents: "<span class='bold person_performing_sanitation_title'></span>: " + index.person_performing_sanitation, classes: "fullColumn"});

                    reportContents.push(notesRow);
                    reportContents.push(personRow);
                });

                console.log(reportContents);
                console.log(JSON.stringify(reportContents));

                // Append everything

                var repTable = reportTable(null, "bordered", reportTitle(null, null, headers), reportBody(null, null, reportContents), null);

                reportWrapper.append(repTable);

                wrapper.append(reportWrapper);

                changeLanguage(localStorage.defaultLanguage);
            } else {
                Materialize.toast("No se encuentra un reporte para esa fecha", 3000, "rounded");
                throw response.meta.message;
            }
        }
    });
}

/*function loadSSOPReport(startDate){
    var report = new Object();
    report.date = startDate;

    $server.request({
        service: 'report-gmp-packing-preop',
        data: report,
        success: function(response) {
            if (response.meta.return_code == 0) {
                var wrapper = divWrapper(null, null);
                var reportWrapper = divWrapper(null, "card-panel white");

                var reportData = response.data;

                wrapper.append(reportHeader(reportData.zone_name, reportData.module_name, reportData.program_name, reportData.log_name, reportData.creation_date, reportData.created_by, reportData.approval_date, reportData.approved_by));

                $("#report_tab").append(wrapper);

                var report = divWrapper(null, null);
                var reportTable = table(null, "bordered");
                var headers = ["Area", "Tiempo", "Numero", "Nombre", "Condiciones", "Acción Correctiva", "Comentarios"];
                //var testContent = [["1", "Mesas", "Aceptable", "N/A", "Comentarios"],["2", "Pisos", "Inceptable", "WSR", "Comentarios"]];

                testContent = response.data.areas[0].items;

                reportTable.append(tableHeader(null, null, headers));

                response.data.areas.forEach(function(index){
                    testContent = index.items;
                    testContent.forEach(function(index){
                        var display = ["", "", index.item_order, index.item_name, "Aceptable", index.item_status, index.item_comments];
                        reportTable.append(tableRow(null, null, display));
                    });
                });

                reportWrapper.append(reportTable);

                wrapper.append(reportWrapper);

                changeLanguage(localStorage.defaultLanguage);
            } else {
                Materialize.toast("No se encuentra un reporte para esa fecha", 3000, "rounded");
                throw response.meta.message;
            }
        }
    });
}*/

function testReportService(){
    var report = new Object();
    report.date = "2016-11-24";
    console.log(report);
    $server.request({
        service: 'report-gmp-packing-preop',
        data: report,
        success: function(response) {
            if (response.meta.return_code == 0) {
                console.log(response.data);
                console.log(JSON.stringify(response.data));
            } else {
                Materialize.toast("Reporte no enviado, verifique la red", 3000, "rounded");
                throw response.meta.message;
            }
        }
    });
}

function sendSSOPReport(){
    var report = new Object();
    var hardware_log = new Array();
    var area_log = new Array();
    report.user_id = localStorage.user_id;
    report.date = getISODate(new Date());
    
    var idArray = new Array();
    var areaArray = new Array();


    // Get Area IDs
    $("div[id^='area_report_']").each(function(index){
        var tag = $(this).attr("id");
        var id = tag.match(/[0-9]+/g);
        areaArray.push(id[0]);
    });

    areaArray.forEach(function(areaID){
        var area = new Object();

        area.time = getISOTime(new Date());
        area.area_id = Number(areaID);
        area.item_logs = new Array();

        idArray = new Array();
        hardware_log = new Array();

        // We get all item id, we treat each one with their respective area
        $("input[id^='acceptable_']").each(function(index){
            var tag = $(this).attr("id");
            var id = tag.match(/[0-9]+/g);
            if(areaID == id[1]){
                console.log("entrado");
                var hardware = new Object();

                hardware.item_id = Number(id[0]);
                hardware.is_acceptable = getBool($("input:radio[name='radio_" + id[0] +"_" + id[1] +"']:checked").val());
                if(hardware.is_acceptable === false) {
                    console.log("lmao inaceptable");
                    hardware.is_acceptable = false;
                    hardware.corrective_action_id = Number($("#select_" + id[0] + "_" + id[1]).val());
                } else {
                    console.log("lmao aceptable");
                    hardware.is_acceptable = true;
                    hardware.corrective_action_id = 1;
                }
                hardware.comment = $("#comment_" + id[0] + "_" + id[1]).val();

                hardware_log.push(hardware);
            }
        });

        area.item_logs = hardware_log;

        area.notes = $("#area_notes_" + areaID).val();
        area.person_performing_sanitation = $("#area_sanitation_" + areaID).val();

        area_log.push(area);
    });

    report.area_log = area_log;

    $server.request({
        service: 'capture-gmp-packing-preop',
        data: report,
        success: function(response) {
            if (response.meta.return_code == 0) {
                Materialize.toast("Reporte enviado con exito", 3000, "rounded");
            } else {
                Materialize.toast("Reporte no enviado, verifique la red", 3000, "rounded");
                throw response.meta.message;
            }
        }
    });

    console.log(report);
    console.log(JSON.stringify(report));
}

function SSOPTypeTitle(type){
    var title = $("<div>");
    title.attr("style", "font-weight: bold;");
    title.append(type);
    return title;
}

function SSOPPreoperativeItem(item, areaID){
    var itemCard = divWrapper(null, "card-panel white");
    var firstRow = divWrapper(null, "row");
    var secondRow = divWrapper(null, "row");
    var title = cardTitle(null, "card-title col s4", item.name);
    var acceptable = logRadioButtonInput("acceptable_" + item.id + "_" + areaID, null, logLabel(null, "col s4", "acceptable_" + item.id + "_" + areaID, '<i class="mdi mdi-checkbox-marked-circle mdi-18px green-text"></i>'), "radio_" + item.id + "_" + areaID, true);
    var unacceptable = logRadioButtonInput("unacceptable_" + item.id + "_" + areaID, null, logLabel(null, "col s4", "unacceptable_" + item.id + "_" + areaID, '<i class="mdi mdi-close-circle mdi-18px red-text"></i>'), "radio_" + item.id + "_" + areaID, false);
    var status = logRadioButtonGroup("radio_" + item.id + "_" + areaID, "col s4", [acceptable, unacceptable]);
    var actionEmpty = logSelectOption(null, null, "", true, true, "Seleccione la acción correctiva");
    var actionNone = logSelectOption(null, null, "1", false, false, "None HARDCODE");
    var actionRC = logSelectOption(null, null, "2", false, false, "Re-cleaned HARDCODE");
    var actionWSR = logSelectOption(null, null, "3", false, false, "Wash/Rinse/Sanitize HARDCODE");;
    var actionsSelect = logSelectInput("select_" + item.id + "_" + areaID, "input-field col s4", [actionEmpty, actionNone, actionRC, actionWSR], logLabel(null, null, "select_" + item.id + "_" + areaID, 'Acción correctiva'));
    var comments = logTextField("comment_wrapper_" + item.id + "_" + areaID, logTextInput("comment_" + item.id + "_" + areaID, "validate", "text", null), logLabel(null, null, "comment_" + item.id + "_" + areaID, "Comentarios"), "input-field col s12");

    // console.log("Ay lmao" + item["item_name"]);
    comments.hide();
    actionsSelect.hide();

    firstRow.append(title);
    firstRow.append(status);
    firstRow.append(actionsSelect);

    secondRow.append(comments);

    itemCard.append(firstRow);
    itemCard.append(secondRow);

    return itemCard;
}

// General functions for date/time formatting

function getISODate(date){
    var ISODate = "";

    ISODate += date.getFullYear() + "-";

    if((date.getMonth() + 1) < 9){
        ISODate += "0" + (date.getMonth() + 1)+ "-";
    } else {
        ISODate += (date.getMonth() + 1) + "-";
    }

    if(date.getDate()<9){
        ISODate += "0" + date.getDate();
    } else {
        ISODate += date.getDate();
    }

    return ISODate;
}

function getISOTime(date){
    var ISOTime = "";

    if(date.getHours()<10){
        ISOTime += "0" + date.getHours() + ":";
    } else {
        ISOTime += date.getHours() + ":";
    }

    if(date.getMinutes()<10){
        ISOTime += "0" + date.getMinutes();
    } else {
        ISOTime += date.getMinutes();
    }
/*
    if(date.getSeconds()<10){
        ISOTime += "0" + date.getSeconds();
    } else {
        ISOTime += date.getSeconds();
    }*/
    
    return ISOTime;
}

function getBool(val) {
    var num;
    return val != null && (!isNaN(num = +val) ? !!num : !!String(val).toLowerCase().replace(!!0, ''));
}

// General functions for form creation

// A header containing the information of the current report, including who made it, the date,
// Zone and program

function logHeader(zone, program, module, log, date, employeeName){
    var reportCard = divWrapper(null, "card-panel white");
    var titleRow = divWrapper(null, "row");
    var infoRow = divWrapper(null, "row");
    var moduleRow = divWrapper(null, "row");
    var logTitle = cardTitle(null, "col s12", log);
    var zoneTitle = cardTitle(null, "col s4", "<span class='zone_name'></span>: " + zone);
    var programTitle = cardTitle(null, "col s4", "<span class='program_name'></span>: " + program);
    var moduleTitle = cardTitle(null, "col s4", "<span class='module_name'></span>: " + module);
    var date = cardTitle(null, "col s4", "<span class='date_name'></span>: " + date);
    var employeeName = cardTitle(null, "col s4", "<span class='made_by'></span>: " + employeeName);

    titleRow.append(logTitle);
    moduleRow.append(zoneTitle);
    moduleRow.append(programTitle);
    moduleRow.append(moduleTitle);
    infoRow.append(date);
    infoRow.append(employeeName);

    reportCard.append(titleRow);
    reportCard.append(moduleRow);
    reportCard.append(infoRow);

    return reportCard;
}

// A generic div wrapper

function divWrapper(id, classes){
    var div = $("<div>");

    div.addClass(classes);
    if(id)
        div.attr("id", id);

    return div;
}

// A card title

function cardTitle(id, classes, contents){
    var title = $("<span>");

    title.addClass(classes);
    if(id)
        title.attr("id", id);

    title.append(contents);

    return title;
}

// A text input/label pair, used very often

function logTextField(id, textInput, label, classes){
    var textField = $("<div>");

    if(id)
        textField.attr("id", id);

    textField.addClass(classes);
    textField.append(textInput);
    textField.append(label);

    return textField;
}

// A text input with the desired id, classes and disabled status
// if necessary

function logTextInput(id, classes, type, isDisabled){
    var disabled = "";
    (typeof id == "string") ? id = 'id="' + id + '"' : id = '';
    (typeof classes == "string") ? classes = 'class="' + classes + '"' : classes = '';
    (typeof type == "string") ? type = 'type="' + type + '"' : type = '';
    isDisabled ? disabled = "disabled" : disabled = ""; 

    var input = '<input ' + disabled + ' ' + id + ' ' + classes + ' ' + type + '>';

    input = $(input);

    return input;
}

// A label, usable for text inputs, text areas, radio buttons and pretty
// much everything

function logLabel(id, classes, labelFor, contents){
    (typeof id == "string") ? id = 'id="' + id + '"' : id = '';
    (typeof classes == "string") ? classes = 'class="' + classes + '"' : classes = '';
    (typeof labelFor == "string") ? labelFor = 'for="' + labelFor + '"' : labelFor = '';

    var label = '<label ' + id + ' ' + classes + ' ' + labelFor + '></label>';

    label = $(label);

    if (contents)
        label.append(contents);

    return label;
}

// Icon wrapper. 

function logIcon(classes){
    var icon = $("<i>");

    icon.addClass(classes);

    return icon;
}

// A way to group radio buttons; buttons must be an array of buttons
// created with logRadioButtonInput

function logRadioButtonGroup(id, classes, buttons){
    var wrapper = $("<div>");

    wrapper.addClass(classes);

    if(id)
        wrapper.attr("id", id);

    for(var button of buttons){
        wrapper.append(button);
    }

    return wrapper;
}

// An individual radio button with all of its elements

function logRadioButtonInput(id, classes, label, groupName, value){
    var wrapper = $("<div>");

    (typeof id == "string") ? id = 'id="' + id + '"' : id = '';
    (typeof classes == "string") ? classes = 'class="' + classes + '"' : classes = '';
    (typeof groupName == "string") ? groupName = 'name="' + groupName + '"' : groupName = '';
    (typeof value != "undefined") ? value = 'value="' + value + '"' : value = '';

    var radioButton = '<input ' + groupName + ' ' + id + ' ' + classes + ' ' + value + ' type="radio" />';

    radioButton = $(radioButton);

    wrapper.append(radioButton);
    wrapper.append(label);

    return wrapper;
}

// A way to group select options; options must be an array of options
// created with logSelectOption

function logSelectInput(id, classes, options, label){
    var wrapper = $("<div>");
    var selectInput = $("<select>");

    wrapper.addClass(classes);
    wrapper.attr("id", "wrapper_" + id);
    selectInput.attr("id", id);

    for(var option of options){
        selectInput.append(option);
    }

    wrapper.append(selectInput);
    wrapper.append(label);

    return wrapper;
}

// An individual select option with all of its elements

function logSelectOption(id, classes, value, isDisabled, isSelected, contents){
    var disabled = "";
    var selected = "";

    (typeof id == "string") ? id = 'id="' + id + '"' : id = '';
    (typeof classes == "string") ? classes = 'class="' + classes + '"' : classes = '';
    (typeof value == "string") ? value = 'value="' + value + '"' : value = '';
    isDisabled ? disabled = "disabled" : disabled = ""; 
    isSelected ? selected = "selected" : selected = ""; 

    var option = '<option ' + id + ' ' + classes + ' ' + value + ' ' + disabled + ' ' + selected + '>' + contents + '</option>';

    return option;
}

// A generic send button. This function only returns 

function sendButton(id){
    return $('<div class="center-align"><a id="' + id + '" class="waves-effect waves-light btn"><span class="send_button"></span>  <i class="mdi mdi-send mdi-18px"></i></a><div>');
}

// General Functions for report generation

function reportHeader(zone, program, module, log, elaborationDate, employeeName, approvalDate, supervisorName){
    var reportCard = divWrapper(null, "card-panel white");
    var titleRow = divWrapper(null, "row");
    var employeeRow = divWrapper(null, "row");
    var supervisorRow = divWrapper(null, "row");
    var moduleRow = divWrapper(null, "row");
    var logTitle = cardTitle(null, "col s12", log);
    var zoneTitle = cardTitle(null, "col s4", "<span class='zone_name'></span>: " + zone);
    var programTitle = cardTitle(null, "col s4", "<span class='program_name'></span>: " + program);
    var moduleTitle = cardTitle(null, "col s4", "<span class='module_name'></span>: " + module);
    var elaborationTitle = cardTitle(null, "col s6", "<span class='elaborated_name'></span>: " + elaborationDate);
    var employeeTitle = cardTitle(null, "col s6", "<span class='made_by'></span>: " + employeeName);
    var approvalTitle = cardTitle(null, "col s6", "<span class='approved_name'></span>: " + approvalDate);
    var supervisorTitle = cardTitle(null, "col s6", "<span class='approved_by'></span>: " + supervisorName);

    titleRow.append(logTitle);
    moduleRow.append(zoneTitle);
    moduleRow.append(programTitle);
    moduleRow.append(moduleTitle);
    employeeRow.append(elaborationTitle);
    employeeRow.append(employeeTitle);
    supervisorRow.append(approvalTitle);
    supervisorRow.append(supervisorTitle);

    reportCard.append(titleRow);
    reportCard.append(moduleRow);
    reportCard.append(employeeRow);
    reportCard.append(supervisorRow);

    return reportCard;
}

function table(id, classes){
    var table = $("<table>");

    table.addClass(classes);

    if(id)
        table.attr("id", id);

    return table;
}

function tableRow(id, classes, contents){
    var row = $("<tr>");

    row.addClass(classes);

    if(id)
        row.attr("id", id);

    contents.forEach(function(index){
        row.append(rowColumn(null, null, index));
    });

    return row;
}

function rowColumn(id, classes, contents){
    var row = $("<td>");

    row.addClass(classes);

    if(id)
        row.attr("id", id);

    row.append(contents);

    return row;
}

function headerColumn(id, classes, contents){
    var row = $("<th>");

    row.addClass(classes);

    if(id)
        row.attr("id", id);

    row.append(contents);

    return row;
}

function tableHeader(id, classes, contents){
    var col = $("<tr>");

    col.addClass(classes);

    if(id)
        col.attr("id", id);

    contents.forEach(function(index){
        col.append(headerColumn(null, null, index));
    });

    return col;
}