<?php

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    require_once dirname(__FILE__)."\\table.php";
}
else {
    require_once dirname(__FILE__)."/table.php";
}

// Data Access Object for the workplace_area_hardware table
class WorkplaceAreaHardware extends Table
{
    // Creates an interface for interacting with the workplace_area_hardware 
    // table in the specified data base
    function __construct($dataBaseConnection)
    {
        parent::__construct($dataBaseConnection, "workplace_area_hardware");
    }
    
    
    // Returns an array of elements that belong to a certain workplace area
    // identified by the specified ID
    function searchItemsByAreaID($areaID)
    {
        return parent::join([
            "[><]workplace_areas" => [
                "workplace_area_id" => "id"
                ],
            "[><]company_zones" => [
                "workplace_areas.company_zone_id" => "id"
                ]
        ], [
            "workplace_area_hardware.id",
            "company_zones.zone_name",
            "workplace_areas.area_name",
            "workplace_area_hardware.hardware_name"
        ], [
            "workplace_area_id" => $areaID
        ]);
    }
}

?>