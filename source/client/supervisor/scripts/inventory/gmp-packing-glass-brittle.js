var _controlsWrapper;
var _contentWrapper;

function addInventoryManager(controlsWrapper, contentWrapper){
    $("#multi_inventory_tabs").show();
    $('ul.tabs').tabs();
    $('.indicator').addClass("green");
    controlsWrapper = "#inventory_controls_wrapper";
    contentWrapper = "#inventory_tab";
    _controlsWrapper = controlsWrapper;
    _contentWrapper = contentWrapper;
    addAreaSelect(controlsWrapper, contentWrapper, null);
    addAreaControlTable("#areas_tab");
}

// Functions exclusive to gmp-packing-glass-brittle

function addAreaControlTable(areasWrapper){
    $server.request({
        service: 'get-areas-of-zone-by-position-gmp-packing-preop',
        success: function(response) {
            if (response.meta.return_code == 0) {
                $(areasWrapper).append(gmpPackingPreopAreasTable(areasWrapper, response.data));
                initAreaSortability("reorder-area-gmp-packing-preop");
                bindEditButtonFunctionality();
                changeLanguage();
            } else {
                throw response.meta.message;
            }
        }
    });
}

function addAreaSelect(controlsWrapper, contentWrapper, defaultValue){
    $server.request({
        service: 'get-areas-of-zone-gmp-packing-preop',
        success: function(response) {
            if (response.meta.return_code == 0) {
                var areaSelectRow = {"columns":[]};

                // Select with all areas
                var areaSelectInput = {"id":"areaSelectWrapper","classes":"input-field col s6 m6 l6"};
                var areaSelect = {"type":"select","id":"area-select","options":[]};

                areaSelect.options.push({"classes":"select_area","disabled":true,"selected":true});

                for(var area of response.data){
                    areaSelect.options.push({"value":area.id,"text":area.name});
                }

                areaSelectInput.field = areaSelect;

                // Text field for adding an area
                var areaNameInput = {"id":"areaNameWrapper","classes":"input-field col s5 m5 l5"};
                var areaName = {"type":"input","id":"area_name","classes":"validate add_workplace_area","fieldType":"text"};
                areaNameInput.field = areaName;

                // Float button to confirm adding a new area
                var areaAddInput = {"id":"addAreaButtonWrapper","classes":"input-field col s1 m1 l1"};
                var areaAddButton = {"type":"floating","id":"add_workplace_area","classes":"btn-floating waves-effect waves-light green right"};
                var areaAddIcon = {"type":"icon","icon":"mdi-plus","size":"mdi-24px"};
                areaAddButton.icon = areaAddIcon;
                areaAddInput.field = areaAddButton;

                areaSelectRow.columns.push(areaSelectInput);
                areaSelectRow.columns.push(areaNameInput);
                areaSelectRow.columns.push(areaAddInput);

                $(controlsWrapper).hide();
                $(controlsWrapper).append(createInputRow(areaSelectRow));

                if(defaultValue != null){
                    $("#area-select").material_select("destroy");
                    $("#area-select").val(defaultValue);
                    $("#area-select").material_select();
                }

                $("#area-select").change(function (e) {
                    $("#sort").remove();
                    loadInventory($(this).val(), contentWrapper);
                });

                $('#add_workplace_area').on('click', function(e) {
                    e.preventDefault();
                    var input = $("#area_name");
                    var isNameEmpty = input.val() == "";
                    if (isNameEmpty) {
                        loadToast("is-workplace-area-empty",4000, "rounded");
                        input.addClass("invalid");
                    } else {
                        $server.request({
                            service: 'add-workplace-area-gmp-packing-preop',
                            data: {area_name: input.val()},
                            success: function(response) {
                                if (response.meta.return_code == 0) {
                                    var option = createOption({"value":response.data.id,"text":response.data.name});
                                    $("#area-select").append(option);
                                    $("#area-select").material_select();
                                    $("#area_name").val("");
                                    $("#area_sort tbody").append(tableRow(gmpPackingPreopAreaRow(response.data)));
                                    loadToast("workplace_area_registered", 2500, "rounded");
                                } else {
                                    loadToast("generic_area", 2500, "rounded");
                                }
                            }
                        });
                    }
                });

                changeLanguage();
                $(controlsWrapper).show(500);
            } else {
                throw response.meta.message;
            }
        }
    });
}

// Functions for area control (reorder and name changing of areas)

function gmpPackingPreopAreasTable(htmlElement, data){
    var tableJSON = {"type":"table","id":"area_sort","classes":"highlight","thead":{},"tbody":{},"tfoot":{}};

    tableJSON.thead = {"type":"thead","rows":[{"type":"tr","columns":[{"type":"th","classes":"inventory_position"},{"type":"th","classes":"inventory_id"},{"type":"th","classes":"inventory_name"},{"type":"th"}]}]};

    tableJSON.tfoot = null;

    tableJSON.tbody = {"type":"tbody","rows":[]};

    for(var area of data){
        tableJSON.tbody.rows.push(gmpPackingPreopAreaRow(area));
    }

    $(htmlElement).append(table(tableJSON));
}

function gmpPackingPreopAreaRow(area){
    // JSON for the inventory row
    var inventoryRow = {"type":"tr","id":"area_" + area.id,"classes":"ui-sortable-handle","columns":[],"data":area};

    // Add information columns. Remember the class "search-column" for dynamic
    // search binding
    inventoryRow.columns.push({"type":"td","contents":area.position,"classes":"position-column"});
    inventoryRow.columns.push({"type":"td","contents":area.id,"classes":"id-column"});
    inventoryRow.columns.push({"type":"td","contents":area.name,"classes":"name-column"});

    inventoryRow.columns.push({"type":"td","contents":gmpPackingPreopAreaEditButton(area)});

    return inventoryRow;
}

function gmpPackingPreopAreaEditableRow(area){
    // JSON for the inventory row
    var inventoryRow = {"type":"tr","id":"edit_area_" + area.id,"classes":"ui-sortable-handle","columns":[],"data":area};

    // Add information columns. Remember the class "search-column" for dynamic
    // search binding
    inventoryRow.columns.push({"type":"td","contents":area.position,"classes":"position-column"});
    inventoryRow.columns.push({"type":"td","contents":area.id,"classes":"id-column"});
    inventoryRow.columns.push({"type":"td","contents":{"field":{"type":"input","id":"area_edit_" + area.id,"classes":"validate","value": area.name,"fieldType":"text"}},"classes":"name-column"});

    inventoryRow.columns.push({"type":"td","contents":gmpPackingPreopAreaSaveButton(area)});

    return inventoryRow;
}

function gmpPackingPreopAreaEditButton(item){
    var buttonField = {"type":"floating","classes":"btn-floating waves-effect waves-light green right","id":"edit_" + item.id,"data":{"id":item.id,"item":item},"icon":{"type": "icon", "icon": "mdi-pencil", "size": "mdi-32px", "color": "white-text"}};

    var buttonInput = {"field":buttonField};

    return buttonInput;
}

function gmpPackingPreopAreaSaveButton(item){
    var buttonField = {"type":"floating","classes":"btn-floating waves-effect waves-light green right","id":"save_" + item.id,"data":{"id":item.id,"item":item},"icon":{"type": "icon", "icon": "mdi-send", "size": "mdi-32px", "color": "white-text"}};

    var buttonInput = {"field":buttonField};

    return buttonInput;
}

function bindEditButtonFunctionality(){
    $("a[id^='edit_']").on("click", function(){
        var tempData = $(this).data("item");
        tempData.position = $("#area_" + tempData.id).children(".position-column").text();
        $("#area_" + $(this).data("id")).after(tableRow(gmpPackingPreopAreaEditableRow(tempData)));
        $("#area_" + $(this).data("id")).remove();
        bindSaveButtonFunctionality()
        changeLanguage();
    });
}

function bindSaveButtonFunctionality(){
    $("a[id^='save_']").on("click", function(){
        console.log("save pressed");
        console.log($("#edit_area_" + areaID).children(".position-column").text());
        var areaID = Number($(this).data("id"));
        var areaPosition = Number($("#edit_area_" + areaID).children(".position-column").text());
        var areaName = $("#area_edit_" + areaID).val();
        var originalName = $(this).data("item").name;
        $server.request({
            service: 'edit-workplace-area-gmp-packing-preop',
            data: {
                "area_id": Number(areaID),
                "area_name": areaName
            },
            success: function(response){
                var updatedArea = {"id":areaID,"position":areaPosition,"name":areaName};
                var currentValue = $("#area-select").val();
                if(response.meta.return_code == 0){
                    loadToast("area_updated", 3500, "rounded");
                    updatedArea.name = areaName;
                    $(_controlsWrapper).html("");
                    addAreaSelect(_controlsWrapper, _contentWrapper, currentValue);
                } else {
                    loadToast("area_name_repeated", 3500, "rounded");
                    updatedArea.name = originalName;
                }
                $("#edit_area_" + areaID).after(tableRow(gmpPackingPreopAreaRow(updatedArea)));
                $("#edit_area_" + areaID).remove();
                bindEditButtonFunctionality();
                changeLanguage();
            }
        });
    });
}

// Functions for the inventory table (adding and toggling inventory items)

function gmpPackingGlassBrittleInventoryTable(htmlElement, data){
    var tableJSON = {"type":"table","id":"sort","classes":"highlight","thead":{},"tbody":{},"tfoot":{}};

    tableJSON.thead = {"type":"thead","rows":[{"type":"tr","columns":[{"type":"th","classes":"inventory_position"},{"type":"th","classes":"inventory_id"},{"type":"th","classes":"inventory_name"},{"type":"th","classes":"quantity_title"},{"type":"th","classes":"inventory_dismiss"}]},{"type":"tr","columns":[{"type":"td","contents":""},{"type":"td","classes":"dynamic-search","contents":{"field":{"type":"input","id":"id-search","classes":"validate id_search","fieldType":"text"}}},{"type":"td","classes":"dynamic-search","contents":{"field":{"type":"input","id":"name-search","classes":"validate name_search","fieldType":"text"}}},{"type":"td","classes":"dynamic-search","contents":{"field":{"type":"input","id":"quantity-search","classes":"validate quantity_search","fieldType":"text"}}},{"type":"td","contents":""}]}]};

    tableJSON.tfoot = {"type":"tfoot","rows":[{"type":"tr","columns":[{"type":"td","contents":""},{"type":"td","contents":""},{"type":"td","contents":{"field":{"type":"input","id":"name_add","classes":"validate add_item","fieldType":"text"}}},{"type":"td","contents":{"field":{"type":"input","id":"quantity_add","classes":"validate add_quantity","fieldType":"text"}}},{"type":"td","contents":{"field":{"type":"floating","id":"add_inventory","classes":"btn-floating waveseffect waves-light green center","icon":{"type":"icon","icon":"mdi-plus","size":"mdi-24px"}}}}]}]};

    tableJSON.tbody = {"type":"tbody","rows":[]};

    for(var item of data){
        tableJSON.tbody.rows.push(gmpPackingGlassBrittleInventoryRow(item));
    }

    $(htmlElement).append(table(tableJSON));

    $("input:checkbox").on("change",function(){
        var itemID = $(this).data("id");
        $server.request({
            service: 'toggle-gmp-packing-glass-brittle',
            data: {id:itemID},
            success: function(response, message, xhr) {
                if($("#inventory_" + itemID).hasClass("grey-text")){
                    loadToast("toggle_item_on_success", 3500, "rounded");
                    $("#inventory_" + itemID).removeClass("grey-text");
                } else {
                    loadToast("toggle_item_off_success", 3500, "rounded");
                    $("#inventory_" + itemID).addClass("grey-text");
                }
            }
        });
    });

    $("#add_inventory").on("click",function(e){
        e.preventDefault();
        if($("#name_add").val() == "" || isWhitespace($("#name_add").val()) || $("#quantity_add").val() == "" || isWhitespace($("#quantity_add").val())){
            loadToast("is-item-empty", 3500, "rounded");
        } else {
            var data = new Object();
            data.name = $("#name_add").val();
            data.quantity = $("#quantity_add").val();
            data.area_id = $("#area-select").val();

            $server.request({
                service: 'add-gmp-packing-glass-brittle',
                data: data,
                success: function(response){
                    // Here we must append the recently added item to the list,
                    // with the id assigned by the server
                    // TODO: Optimize this part, its hideous
                    var item = new Object();
                    item.id = Number(response.data);
                    item.name = $("#name_add").val();
                    item.quantity = $("#quantity_add").val();
                    item.is_active = 1;
                    item.order = Number($($("tbody tr").last().children()[0]).text()) + 1;
                    $("tbody").append(tableRow(gmpPackingGlassBrittleInventoryRow(item, item.type)));
                    initSortability("reorder-gmp-packing-glass-brittle");
                    $("html, body").animate({
                        scrollTop: $(document).height()
                    }, 400);
                    $("#name_add").val("");
                    $("#quantity_add").val("");
                    loadToast("item_add_success", 3500, "rounded");
                    changeLanguage(localStorage.defaultLanguage);
                }
            });
        }
    });
}

function gmpPackingGlassBrittleInventoryRow(item){
    // JSON for the inventory row
    var inventoryRow = {"type":"tr","id":"inventory_" + item.id,"classes":"ui-sortable-handle","columns":[]};

    if(item.is_active == 0){
        inventoryRow.classes = inventoryRow.classes + " grey-text";
    }

    // Add information columns. Remember the class "search-column" for dynamic
    // search binding
    inventoryRow.columns.push({"type":"td","contents":item.order,"classes":"position-column"});
    inventoryRow.columns.push({"type":"td","contents":item.id,"classes":"id-column search-column"});
    inventoryRow.columns.push({"type":"td","contents":item.name,"classes":"name-column search-column"});
    inventoryRow.columns.push({"type":"td","contents":item.quantity,"classes":"quantity-column search-column"});

    // Add switch to toggle activaction or deactivation of the item
    inventoryRow.columns.push({"type":"td","contents":gmpPackingGlassBrittleSwitch(item)});

    return inventoryRow;
}

function gmpPackingGlassBrittleSwitch(item){
    var switchField = {"type":"switch","id":"switch_" + item.id,"data":{"id":item.id}};

    if(item.is_active == 1){
        switchField.checked = true;
    }

    var switchInput = {"field":switchField};

    return switchInput;
}

function initSortability(sortingService){
    $("#sort tbody").sortable({
        helper: fixHelper,
        cursor: "move",
        update: function(event, ui) {
            $("tbody").each(function(bodyIndex) {
                $(this).children().each(function(rowIndex) {
                    $($(this).children()[0]).text(rowIndex + 1);
                    var order = $($(this).children()[0]).text();
                    var itemID = $($(this).children()[1]).text();
                    var data = new Object();
                    data.item_id = parseInt(itemID);
                    data.position = parseInt(order);
                    $server.request({
                        service: sortingService,
                        data: data
                    });
                });
            });
        }
    });

    var fixHelper = function(e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
          $(this).width($originals.eq(index).width());
        });
        return $helper;
    };
}

function initAreaSortability(sortingService){
    $("#area_sort tbody").sortable({
        helper: fixHelper,
        cursor: "move",
        update: function(event, ui) {
            //Comented lines were used to reorganize the area-select contents; no longer needed since
            //the area list will be organized in alphabetic order
            //$("#area-select").html("");
            //$("#area-select").append(createOption({"classes":"select_area","disabled":true,"selected":true}));
            $("#area_sort tbody").each(function(bodyIndex) {
                $(this).children().each(function(rowIndex) {
                    $($(this).children()[0]).text(rowIndex + 1);
                    var order = $($(this).children()[0]).text();
                    var itemID = $($(this).children()[1]).text();
                    var data = new Object();
                    data.item_id = parseInt(itemID);
                    data.position = parseInt(order);
                    $server.request({
                        service: sortingService,
                        data: data
                    });
                    //$("select").material_select("destroy");
                    //$("#area-select").append(createOption({"value":$(this).data("id"),"text":$(this).data("name")}));
                    //$("select").material_select();
                    changeLanguage();
                });
            });
        }
    });

    var fixHelper = function(e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
          $(this).width($originals.eq(index).width());
        });
        return $helper;
    };
}

function loadInventory(areaID, htmlElement){
    var data = new Object();
    data.area_id = areaID;

    $server.request({
        service: 'inventory-gmp-packing-glass-brittle',
        data: data,
        success: function(response){
            $(htmlElement).hide();
            gmpPackingGlassBrittleInventoryTable(htmlElement, response.data);
            changeLanguage();
            initSortability("reorder-gmp-packing-glass-brittle");
            dynamicSearchBind("id-search", "id-column");
            dynamicSearchBind("name-search", "name-column");
            dynamicSearchBind("type-search", "type-column");
            dynamicSearchBind("quantity-search", "quantity-column");
            $(htmlElement).show(400);
        }
    });
}
