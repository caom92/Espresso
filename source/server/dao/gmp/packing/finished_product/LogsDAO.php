<?php

// Namespace for the project's Data Access Objects
namespace fsm\database\gmp\packing\finishedProduct;

// Importing required classes
require_once realpath(dirname(__FILE__)."/../../../LogDAO.php");

use fsm\database as db;


// Data Access Object for the gmp_packing_finished_product_logs table
class LogsDAO extends db\LogDAO
{
    // Creates an interface for interacting with the 
    // gmp_packing_finished_product_logs table in the specified data base
    function __construct()
    {
        parent::__construct('gmp_packing_finished_product_logs');
    }


    // Returns a list of all the log data that has the especified capture date 
    // ID
    function selectByCaptureDateID($dateID)
    {
        return parent::select(
            [
                'batch',
                'a.name(production_area_name)',
                's.id(supplier_id)',
                'p.code(product_code)',
                'c.id(customer_id)',
                'q.name(quality)',
                'origin',
                'expiration_date',
                'water_temperature',
                'product_temperature',
                'is_weight_correct',
                'is_label_correct',
                'is_trackable',
                'notes'
            ],
            [
                'capture_date_id' => $dateID
            ],
            [
                '[><]gmp_packing_finished_product_production_areas(a)' => [
                    'production_areas_id' => 'id'
                ],
                '[><]suppliers(s)' => [
                    'supplier_id' => 'id'
                ],
                '[><]product(p)' => [
                    'product_id' => 'id'
                ],
                '[><]customers(c)' => [
                    'customer_id' => 'id'
                ],
                '[><]quality_types(q)' => [
                    'quality_type_id' => 'id'
                ]
            ]
        );
    }
}

?>