<?php

// Namespace for the project's Data Access Objects
namespace fsm\database;

// Importing required classes
require_once realpath(dirname(__FILE__)."/InsertableDAO.php");


// Data Access Object for the customers table
class CustomersDAO extends db\InsertableDAO
{
    // Creates an interface for interacting with the 
    // customers table in the specified data base
    function __construct()
    {
        parent::__construct('customers');
    }


    // Returns an associative which contains the list of the names of all the 
    // registered customers
    function selectName()
    {
        return parent::select(
            [ "$this->table.id", "i.company_name(name)" ],
            [],
            [
                '[><]contact_info(i)' => [
                    'contact_info_id' => 'id'
                ]
            ]
        );
    }


    // Returns the company name of the customer with the especified ID
    function getNameByID($id)
    {
        $row = parent::select(
            [ 'i.company_name' ],
            [ 'id' => $id ],
            [ 
                '[><]contact_info(i)' => [
                    'contact_info_id' => 'id'
                ]    
            ]
        );
        return (isset($row)) ? $row[0]['company_name'] : NULL;
    }
}

?>