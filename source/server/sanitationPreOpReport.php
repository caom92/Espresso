<?php

require_once dirname(__FILE__)."\\dao\\sanitationPreOpLog.php";

// initialize all the variables related with the data base
$dataBaseConnection = null;
$log = null;
$logEntries = [];

// attempt to connect to the data base and query the data from the sanitation
// pre op log
try {
    $dataBaseConnection = connectToDataBase();
    $log = new SanitationPreOpLog($dataBaseConnection);
    $logEntries = $log->findItemsByDate(/*$_GET["date"]*/"2016-03-07");
}
catch (Exception $e) {
    displayErrorPageAndExit($e->getCode(), $e->getMessage());
}

// Initialize the JSON to be sent to the client
$outputJSON = [
    "error_code" => 0,
    "error_message" => "",
    "data" => []
];

// create temporal variables needed to reorganized the data read
// from the data base by area names
$area = "";
$areaJSON = [];

// read each element from the data array
foreach ($logEntries as $entry) {
    // if the area name changed and the temporal JSON is not empty,
    // then we keep the temporal JSON
    if ($area != $entry["area_name"]) {
        if (count($areaJSON) != 0) {
            array_push($outputJSON["data"], $areaJSON);
        }
        
        // then we store the new area name and create a new temporal JSON
        $area = $entry["area_name"];
        $areaJSON = [
            "date" => $entry["date"],
            "area_name" => $entry["area_name"],
            "hardware" => []
        ];
    }
    
    // every hardware status info that is associated to the same workplace
    // area are grouped together into a single array so that there is no
    // duplicated data sent to the client
    if ($area == $entry["area_name"]) {
        array_push($areaJSON["hardware"], [
            "hardware_name" => $entry["hardware_name"],
            "status" => $entry["status"],
            "corrective_action" => $entry["action_name"],
            "comment" => $entry["comment"]
        ]);
    }
}

// don't forget to save the last data entry to the final JSON
array_push($outputJSON["data"], $areaJSON);

// Send the data to the client as a JSON with the following format
/*{
    error_code:[int],
    error_message:[string],
    data:[array<area>]
}
where area is:
{
    date:[date],
    area_name:[string],
    hardware:[array<hardware>]
}
where hardware is: {
    hardware_name:[string]
    status:[bool]
    corrective_action:[string]
    comment:[strig]
}*/
echo json_encode($outputJSON);

?>