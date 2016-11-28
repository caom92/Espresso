<?php

// Namespace for the project's Data Access Objects
namespace fsm\database\gmp\packing\preop;

// Importing required classes
require_once realpath(dirname(__FILE__)."/../../../DataAccessObject.php");

use fsm\database as db;

// Data Access Object for the gmp_packing_preop_items_log table
class ItemsLogDAO extends db\DataAccessObject
{
    // Creates an interface for interacting with the 
    // gmp_packing_preop_items_log table in the specified data base
    function __construct()
    {
        parent::__construct("gmp_packing_preop_items_log");
    }


    // Inserts the specified data elements into the table in question
    // [in]    rows: an array of associative arrays that define the column 
    //         names and their corresponding values to be inserted into the 
    //         table
    // [out]   return: the ID of the last inserted row
    function insert($rows)
    {
        return parent::insert($rows);
    }


    // Returns an associative array with the per item log data that was
    // captured in a specific per area log defined by the given ID
    function selectByAreaLogID($areaLogID)
    {
        return parent::select(
            [
                'a.id(area_id)',
                'a.name(area_name)',
                'i.position', 
                'i.name(item_name)',
                'is_acceptable',
                'ca.code(corrective_action)',
                'comment'  
            ],
            [
                'area_log_id' => $areaLogID
            ],
            [
                '[><]gmp_packing_preop_corrective_actions(ca)' => [
                    'corrective_action_id' => 'id'
                ],
                '[><]items(i)' => [
                    'item_id' => 'id'
                ],
                '[><]working_areas(a)' => [
                    'i.area_id' => 'id'
                ]
            ]
        );
    }
}

?>