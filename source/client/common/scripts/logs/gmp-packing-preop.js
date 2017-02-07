// DatePicker is common to all reports. It's used to select a range of dates
// to display in report form

// Wrapper for loading a Log Form. For convenience's sake, this name will
// be shared among all log types

function loadLogForm(htmlElement){
    console.log("Wrapper was called to load log form");
    $server.request({
        service: 'log-gmp-packing-preop',
        success: function(response) {
            if (response.meta.return_code == 0) {
                var report = response.data;
                console.log(report);
                var header = {"rows":[{"columns":[{"styleClasses":"col s12 m12 l12", "columnText":report.log_name, "id":"log_name"}]},{"columns":[{"styleClasses":"col s4 m4 l4","textClasses":"zone_name","columnText":report.zone_name},{"styleClasses":"col s4 m4 l4","textClasses":"program_name","columnText":report.program_name},{"styleClasses":"col s4 m4 l4","textClasses":"module_name","columnText":report.module_name}]},{"columns":[{"styleClasses":"col s6 m6 l6","textClasses":"date_name","columnText":getISODate(new Date())},{"styleClasses":"col s6 m6 l6","textClasses":"made_by","columnText":localStorage.first_name + " " + localStorage.last_name}]}]};
                $(htmlElement).append(logHeader(header));
                gmpPackingPreopLog(report, htmlElement);
                loadFunctionality({"isPrefilled":false});
                changeLanguage(localStorage.defaultLanguage);
                $("#send_report").click(function(){
                    sendGmpPackingPreopReport();
                });
                $('.log_title').html($("#log_name").text());
                Materialize.toast("Informacion cargada del server", 3000, "rounded");
            } else {
                Materialize.toast("Some error", 3000, "rounded");
                throw response.meta.message;
            }
        }
    });
}

function loadPrefilledLogForm(htmlElement, data){
    console.log("Wrapper was called for a prefilled log form");
    $server.request({
        service: 'report-gmp-packing-preop',
        data: data,
        success: function(response) {
            if (response.meta.return_code == 0) {
                $(htmlElement).html("");
                var report = response.data[0];
                var header = {"rows":[{"columns":[{"styleClasses":"col s12 m12 l12", "columnText":report.log_name}]},{"columns":[{"styleClasses":"col s4 m4 l4","textClasses":"zone_name","columnText":report.zone_name},{"styleClasses":"col s4 m4 l4","textClasses":"program_name","columnText":report.program_name},{"styleClasses":"col s4 m4 l4","textClasses":"module_name","columnText":report.module_name}]},{"columns":[{"styleClasses":"col s6 m6 l6","textClasses":"date_name","columnText":report.creation_date},{"styleClasses":"col s6 m6 l6","textClasses":"made_by","columnText":report.created_by}]}]};
                $(htmlElement).append(logHeader(header));
                gmpPackingPreopLog(report, htmlElement);
                loadFunctionality({"isPrefilled":true});
                $("#send_report").click(function(){
                    updateGmpPackingPreopReport(parseInt(data.report_id));
                });
                changeLanguage(localStorage.defaultLanguage);
                Materialize.toast("Informacion cargada del server", 3000, "rounded");
            } else {
                Materialize.toast("Some error", 3000, "rounded");
                throw response.meta.message;
            }
        }
    });
}

function loadFunctionality(data){
    console.log("Wrapper was called to trigger functionality");
    gmpPackingPreopFunctionality(data);
}

// Wrapper for showing a HTML report. For convenience's sake, this name will
// be shared among all log types

function loadReport(data){
    return gmpPackingPreopReport(data);
}

/******************************************************************************
A collection of functions to display the Log Form. This will be related to the
name of the log, located in the name_suffix field on the database. Usually, we
are going to divide them into full log, area log and individual item log.
******************************************************************************/

function sendGmpPackingPreopReport(){
    var report = new Object();

    report.user_id = localStorage.user_id;
    report.date = getISODate(new Date());
    report.notes = $("#report_comment").val();
    report.album_url = $("#report_url").val();
    report.areas = new Array();

    $(".area-card").each(function(){
        var area = new Object();
        var areaID = $(this).data("id");
        area.id = areaID;
        area.time = $("#time_" + areaID).val();
        area.notes = $("#notes_" + areaID).val();
        area.person_performing_sanitation = $("#sanitation_" + areaID).val();
        area.items = new Array();
        $(this).children(".item-card").each(function(){
            var item = new Object();
            var itemID = $(this).data("id");
            item.id = itemID;
            item.is_acceptable = getBool($("input:radio[name='radio_" + itemID + "']:checked").val());
            if(item.is_acceptable){
                item.corrective_action_id = 1;
                item.comment = "";
            } else {
                item.corrective_action_id = parseInt($("#correctiveAction_" + itemID).val());
                item.comment = $("#comment_" + itemID).val();
            }
            area.items.push(item);
        });
        report.areas.push(area);
    });

    console.log(report);

    $server.request({
        service: 'capture-gmp-packing-preop',
        data: report,
        success: function(response){
            if (response.meta.return_code == 0) {
                Materialize.toast("Reporte enviado con exito", 3000, "rounded");
            } else {
                Materialize.toast(response.meta.message, 3000, "rounded");
            }
        }
    });
}

function updateGmpPackingPreopReport(reportID){
    var report = new Object();

    report.report_id = reportID;
    report.notes = $("#report_comment").val();
    report.album_url = $("#report_url").val();
    report.areas = new Array();

    $(".area-card").each(function(){
        var area = new Object();
        var areaID = $(this).data("id");
        area.id = areaID;
        area.time = $("#time_" + areaID).val();
        area.notes = $("#notes_" + areaID).val();
        area.person_performing_sanitation = $("#sanitation_" + areaID).val();
        area.items = new Array();
        $(this).children(".item-card").each(function(){
            var item = new Object();
            var itemID = $(this).data("id");
            item.id = itemID;
            item.is_acceptable = getBool($("input:radio[name='radio_" + itemID + "']:checked").val());
            if(item.is_acceptable){
                item.corrective_action_id = 1;
                item.comment = "";
            } else {
                item.corrective_action_id = parseInt($("#correctiveAction_" + itemID).val());
                item.comment = $("#comment_" + itemID).val();
            }
            area.items.push(item);
        });
        report.areas.push(area);
    });

    console.log(report);

    $server.request({
        service: 'update-gmp-packing-preop',
        data: report,
        success: function(response){
            if (response.meta.return_code == 0) {
                Materialize.toast("Reporte enviado con exito", 3000, "rounded");
                $("#content_wrapper").hide();
                $("#authorizations_wrapper").show();
            } else {
                Materialize.toast(response.meta.message, 3000, "rounded");
            }
        }
    });
}

function gmpPackingPreopLog(data, htmlElement){
    var log = $("<div>");
    var additionalData = $("<div>");

    console.log(data);
    for(var area of data.areas){
        log.append(gmpPackingPreopArea(area));
    }

    additionalData.addClass("card-panel white");

    additionalData.append(createText({"type":"text","classes":"report_additional_info"}));
    additionalData.append(createInputRow({"columns":[gmpPackingPreopComment(data.notes)]}));
    additionalData.append(createInputRow({"columns":[gmpPackingPreopAlbumURL(data.album_url)]}));

    log.append(additionalData);
    log.append($("<div class='row'>").append(createButton(gmpPackingPreopSendButton())));

    $(htmlElement).append(log);
}

function gmpPackingPreopComment(reportComment){
    var commentLabel = {"type":"label","contents":{"type":"text","classes":"comment_title"}};
    var commentInput = {"type":"input","id": "report_comment", "classes": "validate", "fieldType":"text"};
    var commentFullInput = {"id":"reportCommentWrapper","classes":"input-field col s12 m12 l12","field":commentInput,"label":commentLabel};

    if(reportComment){
        commentInput.value = reportComment;
        commentLabel.classes = "active";
    }

    return commentFullInput;
}

function gmpPackingPreopAlbumURL(reportUrl){
    var urlLabel = {"type":"label","contents":{"type":"text","classes":"url_title"}};
    var urlInput = {"type":"input","id": "report_url", "classes": "validate", "fieldType":"text"};
    var urlFullInput = {"id":"reportUrlWrapper","classes":"input-field col s12 m12 l12","field":urlInput,"label":urlLabel};

    if(reportUrl){
        urlInput.value = reportUrl;
        urlLabel.classes = "active";
    }

    return urlFullInput;
}

function gmpPackingPreopSendButton(){
    var button = {"type":"button","id":"send_report","icon":{"type":"icon","icon":"mdi-send","size":"mdi-18px", "text":{"type":"text","classes":"send_button"}}};

    return button;
}

function gmpPackingPreopArea(area){
    var areaCard = $("<div>");
    var title = $("<div>");

    areaCard.addClass("card-panel white area-card");
    areaCard.data("id", area.id);
    title.addClass("card-title");
    title.append(createIcon({"type":"icon","icon":"mdi-cube-outline","size":"mdi-18px","color":"blue-text", "text":{"type":"text","classes":"blue-text","text":area.name}}));
    areaCard.append(title);

    areaCard.append(createInputRow({"columns":[gmpPackingPreopAreaTime(area.id, area.time)]}));

    for(var type of area.types){
        var typeTitle = $("<div>");
        typeTitle.addClass("card-title");
        typeTitle.attr("style", "font-weight: bold;");
        typeTitle.append(createText({"type":"text","text":type.name}));
        areaCard.append(typeTitle);
        for(var item of type.items){
            areaCard.append(gmpPackingPreopItem(item, area.id));
        }
    }

    areaCard.append(createInputRow({"columns":[gmpPackingPreopAreaNotes(area.id, area.notes)]}));
    areaCard.append(createInputRow({"columns":[gmpPackingPreopAreaSanitation(area.id, area.person_performing_sanitation)]}));

    return areaCard;
}

function gmpPackingPreopAreaTime(areaID, time){
    var timeLabel = {"type":"label","contents":{"type":"text","classes":"time_title"},"for":"time_" + areaID,"classes":"active"};
    var timeInput = {"type":"input","id": "time_" + areaID, "classes": "validate", "fieldType":"text","disabled":true,"data":{"area_id":areaID},"value":getISOTime(new Date())};
    var timeFullInput = {"id":"timeWrapper_" + areaID,"classes":"input-field col s12 m12 l12","field":timeInput,"label":timeLabel};

    if(time){
        timeInput.value = time;
    }

    return timeFullInput;
}

function gmpPackingPreopAreaNotes(areaID, notes){
    var notesLabel = {"type":"label","contents":{"type":"text","classes":"notes_title"},"for":"notes_" + areaID};
    var notesInput = {"type":"input","id": "notes_" + areaID, "classes": "timeChanger validate", "fieldType":"text","data":{"area_id":areaID}};
    var notesFullInput = {"id":"notesWrapper_" + areaID,"classes":"input-field col s12 m12 l12","field":notesInput,"label":notesLabel};

    if(notes){
        notesInput.value = notes;
        notesLabel.classes = "active";
    }

    return notesFullInput;
}

function gmpPackingPreopAreaSanitation(areaID, person){
    var sanitationLabel = {"type":"label","contents":{"type":"text","classes":"person_performing_sanitation_title"},"for":"sanitation_" + areaID};
    var sanitationInput = {"type":"input","id": "sanitation_" + areaID, "classes": "timeChanger validate", "fieldType":"text","data":{"area_id":areaID}};
    var sanitationFullInput = {"id":"sanitationWrapper_" + areaID,"classes":"input-field col s12 m12 l12","field":sanitationInput,"label":sanitationLabel};

    if(person){
        sanitationInput.value = person;
        sanitationLabel.classes = "active";
    }

    return sanitationFullInput;
}

function gmpPackingPreopItem(item, areaID){
    var itemCard = $("<div>");    
    var itemRow = new Object();
    var commentRow = new Object();

    itemRow.columns = [gmpPackingPreopItemTitle(item, areaID), gmpPackingPreopItemStatus(item, areaID), gmpPackingPreopItemCorrectiveAction(item, areaID)];
    commentRow.columns = [gmpPackingPreopItemComment(item, areaID)];

    itemCard.append(createInputRow(itemRow));
    itemCard.append(createInputRow(commentRow));
    itemCard.addClass("card-panel white item-card");
    itemCard.data("id", item.id);

    return itemCard;
}

function gmpPackingPreopItemTitle(item, areaID){
    var itemTitle = {"type":"text","id":"title_" + item.id, "text":item.name};
    var titleInput = {"id":"titleWrapper_" + item.id,"classes":"card-title col s4 m4 l4","field": itemTitle};

    return titleInput;
}

function gmpPackingPreopItemStatus(item, areaID){
    var acceptableIcon = {"type":"icon","icon":"mdi-check-circle","size":"mdi-18px","color":"green-text", "text":{"type":"text","classes":"acceptable_tag green-text"}};
    var unacceptableIcon = {"type":"icon","icon":"mdi-close-circle","size":"mdi-18px","color":"red-text", "text":{"type":"text","classes":"unacceptable_tag red-text"}};    
    var radioAcceptable = {"type":"radio","id":"acceptable_" + item.id,"classes":"timeChanger","value":"true","label":{"type":"label","for":"acceptable_" + item.id,"contents": acceptableIcon},"data":{"area_id":areaID,"item_id":item.id}};
    var radioUnacceptable = {"type":"radio","id":"unacceptable_" + item.id,"classes":"timeChanger","value":"false","label":{"type":"label","for":"unacceptable_" + item.id,"contents": unacceptableIcon},"data":{"area_id":areaID,"item_id":item.id}};
    var itemRadioGroup = {"type": "radioGroup", "id":"radioGroup_"  + item.id,"classes":"col s12 m12 l12","group":"radio_" + item.id,"radioArray":[radioAcceptable, radioUnacceptable]};
    var groupInput = {"id":"radioWrapper_" + item.id,"classes":"col s8 m8 l4","field":itemRadioGroup};

    if(item.status == 1){
        radioAcceptable.checked = true;
    } else if (item.status == 0){
        radioUnacceptable.checked = true;
    }

    return groupInput;
}

function gmpPackingPreopItemCorrectiveAction(item, areaID){
    var actionOptions = new Array();

    for(var action of JSON.parse(localStorage.correctiveActionsSSOP)){
        var tempOption = {"value":action.id,"text":action.name,"classes":"timeChanger","data":{"area_id":areaID,"item_id":item.id}};
        if(item.corrective_action_id == action.id){
            tempOption.selected = true;
        }
        actionOptions.push(tempOption);
    }

    var selectLabel = {"type":"label","contents":{"type":"text","classes":"action_title"}};
    var actionSelect =  {"type": "select", "id": "correctiveAction_" + item.id,"classes":"timeChanger", "options": actionOptions,"data":{"area_id":areaID,"item_id":item.id}};
    var actionSelectInput = {"id":"correctiveActionWrapper_" + item.id,"classes":"input-field col s12 m12 l4","hidden": true,"field":actionSelect,"label":selectLabel,"data":{"area_id":areaID,"item_id":item.id}};

    return actionSelectInput;
}

function gmpPackingPreopItemComment(item, areaID){
    var commentLabel = {"type":"label","contents":{"type":"text","classes":"comment_title"}};
    var commentInput = {"type":"input","id": "comment_" + item.id, "classes": "validate timeChanger", "fieldType":"text","data":{"area_id":areaID,"item_id":item.id}};
    var commentFullInput = {"id":"commentWrapper_" + item.id,"classes":"input-field col s12 m12 l12","hidden": true,"field":commentInput,"label":commentLabel};

    if(item.comment){
        commentInput.value = item.comment;
        commentLabel.classes = "active";
    }

    return commentFullInput;
}

function gmpPackingPreopFunctionality(data){
    $("input[id^='unacceptable_']:checked").each(function(){
        var tag = $(this).attr("id");
        var id = tag.match(/[0-9]+/g);
        $("#correctiveActionWrapper_" + id[0]).show(500);
        $("#commentWrapper_" + id[0]).show(500);
    });

    $("input[id^='acceptable_']").change(function(){
        if($(this).is(":checked")){
            var tag = $(this).attr("id");
            var id = tag.match(/[0-9]+/g);
            $("#correctiveActionWrapper_" + id[0]).hide(500);
            $("#commentWrapper_" + id[0]).hide(500);
        }
    });

    $("input[id^='unacceptable_']").change(function(){
        if($(this).is(":checked")){
            var tag = $(this).attr("id");
            var id = tag.match(/[0-9]+/g);
            $("#correctiveActionWrapper_" + id[0]).show(500);
            $("#commentWrapper_" + id[0]).show(500);
        }
    });

    if(data.isPrefilled){
        $("input[id^='unacceptable_']:checked").each(function(){
            var tag = $(this).attr("id");
            var id = tag.match(/[0-9]+/g);
            $("#correctiveActionWrapper_" + id[0]).show(500);
            $("#commentWrapper_" + id[0]).show(500);
        });
    } else {
        $(".timeChanger").change(function(){
            if($(this).data().area_id)
                $("#time_" + $(this).data().area_id).val(getISOTime(new Date()));
        });
    }
}

// Full report

function gmpPackingPreopReport(data){
    var report = new Object();

    report.type = "table";
    report.classes = "bordered highlight";
    report.id = "report_" + data.report_id;

    report.thead = gmpPackingPreopReportHeader();
    report.tbody = gmpPackingPreopReportBody(data);
    report.tfoot = gmpPackingPreopReportFooter(data);

    console.log(JSON.stringify(report));
    console.log(report);

    return report;
}

// Header containing Area, Time, Number, Name, Conditions, Corrective Actions
// and Comment. This header contain the classes to borrow the text from
// languages.xml, not strings

function gmpPackingPreopReportHeader(){
    var header = {"type":"thead","rows":[{"type":"tr","columns":[{"type":"th","classes":"area_title areaColumn"},{"type":"th","classes":"time_title timeColumn"},{"type":"th","classes":"number_title numberColumn"},{"type":"th","classes":"name_title nameColumn"},{"type":"th","classes":"status_title statusColumn"},{"type":"th","classes":"action_title actionColumn"},{"type":"th","classes":"comment_title commentColumn"}]}]};

    return header;
}

// Body containing all the information, except for the report notes and album
// URL

function gmpPackingPreopReportBody(data){
    var body = {"type":"tbody"};

    body.rows = new Array();

    for(var area of data.areas){
        var firstRowFlag = true;
        for(var type of area.types){
            console.log(type);
            var row = {"type":"tr"};
            row.columns = new Array();
            if(firstRowFlag){
                var rowspan = area.types.length;
                for(var count of area.types){
                    rowspan += count.items.length;
                }
                row.columns.push(gmpPackingPreopReportAreaName(area.name, rowspan));
                row.columns.push(gmpPackingPreopReportAreaTime(area.time, rowspan));
                row.columns.push(gmpPackingPreopReportTypeTitle(type.name, 5));
                firstRowFlag = false;
            } else {
                row.columns.push(gmpPackingPreopReportTypeTitle(type.name, 5));
            }
            body.rows.push(row);
            for(var item of type.items){
                var itemRow = {"type":"tr"};
                itemRow.columns = gmpPackingPreopReportItem(item);
                body.rows.push(itemRow);
            }
        }
        var notesRow = {"type":"tr"};
        var sanitationRow = {"type":"tr"};
        notesRow.columns = [gmpPackingPreopReportAreaNotes(area.notes, 7)];
        sanitationRow.columns = [gmpPackingPreopReportAreaSanitation(area.person_performing_sanitation, 7)];
        body.rows.push(notesRow);
        body.rows.push(sanitationRow);
    }

    var reportNotesRow = {"type":"tr"};
    var reportAlbumURL = {"type":"tr"};
    reportNotesRow.columns = [gmpPackingPreopReportNotes(data.notes, 7)];
    reportAlbumURL.columns = [gmpPackingPreopReportAlbumURL(data.album_url, 7)];

    body.rows.push(reportNotesRow);
    body.rows.push(reportAlbumURL);

    return body;
}

// Type title, colspan 5
// Example: Food Contact - Daily and Non Food Contact - Daily

function gmpPackingPreopReportTypeTitle(title, colspan){
    var typeTitle = {"type":"td","classes":"typeTitle","colspan":colspan,"contents":title};

    return typeTitle;
}

// A row with five 'td' elements, including the number, name, status,
// corrective action text and comment

function gmpPackingPreopReportItem(itemData){
    var item = new Array();

    item.push({"type":"td","classes":"numberColumn","contents":itemData.order});
    item.push({"type":"td","classes":"nameColumn","contents":itemData.name});
    if(itemData.status){
        item.push({"type":"td","classes":"statusColumn acceptable_tag"});
    } else {
        item.push({"type":"td","classes":"statusColumn unacceptable_tag"});
    }    
    item.push({"type":"td","classes":"actionColumn","contents":itemData.corrective_action});
    item.push({"type":"td","classes":"commentColumn","contents":itemData.comment});

    console.log(item);

    return item;
}

// Area name. It will have a rowspan equal to the number of items + the
// number of types

function gmpPackingPreopReportAreaName(name, rowspan){
    var areaName = {"type":"td","classes":"areaColumn","rowspan":rowspan,"contents":name};

    return areaName;
}

// Area time. It will have a rowspan equal to the number of items + the
// number of types

function gmpPackingPreopReportAreaTime(time, rowspan){
    var areaTime = {"type":"td","classes":"timeColumn","rowspan":rowspan,"contents":time};

    return areaTime;
}

// Area notes. It will have a colspan equal to the number of columns

function gmpPackingPreopReportAreaNotes(notes, colspan){
    var areaNotes = {"type":"td","classes":"fullColumn","colspan":colspan,"contents":"<span class='notes_title'></span>: " + notes};

    return areaNotes;
}

// Area sanitation. It will have a colspan equal to the number of columns

function gmpPackingPreopReportAreaSanitation(sanitation, colspan){
    var areaSanitation = {"type":"td","classes":"fullColumn","colspan":colspan,"contents":"<span class='person_performing_sanitation_title'></span>: " + sanitation};

    return areaSanitation;
}

// Footer

function gmpPackingPreopReportFooter(data){

}

// Notes for the report. They will go in the footer. Colspan equal to the
// number of columns

function gmpPackingPreopReportNotes(notes, colspan){
    var reportNotes = {"type":"td","classes":"fullColumn","colspan":colspan,"contents":"<span class='report_notes_title'></span>: " + notes};

    return reportNotes;
}

// Album URL. It will go in the footer. Colspan equal to the
// number of columns

function gmpPackingPreopReportAlbumURL(albumURL, colspan){
    var reportURL = {"type":"td","classes":"fullColumn","colspan":colspan,"contents":"<span class='url_title'></span>: <a href='" + albumURL + "' >" + albumURL + "</a>"};

    return reportURL;
}

function getCSS(){
    return '<style>table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}td { border: 1px solid #000000; text-align: left;}th { border: 1px solid #000000; text-align: left; font-weight: bold; background-color: #4CAF50;}.even { background-color: #b8e0b9;}.verticaltext{ writing-mode:tb-rl; transform: rotate(90deg); white-space:nowrap; word-break:break-word; bottom:0;}.typeTitle{ background-color: yellow; width:501px;}.fullColumn{ background-color: #D3D3D3;width:631px;}.nameColumn{ width:116px;}.numberColumn{ width:30px;}.timeColumn{ width:40px;}.areaColumn{ width:90px;}.statusColumn{ width:85px;}.actionColumn{ width:70px;}.commentColumn{ width:200px;}</style>';
}