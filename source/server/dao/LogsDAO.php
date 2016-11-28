<?php

// Namespace for the project's Data Access Objects
namespace fsm\database;

// Importing required classes
require_once realpath(dirname(__FILE__)."/DataAccessObject.php");

// Data Access Object for the logs table
class LogsDAO extends DataAccessObject
{
    // Creates an interface for interacting with the 
    // users table in the specified data base
    function __construct()
    {
        parent::__construct("logs");
    }


    // Returns an associative array containing a list of all the logs stored
    // in the data base alongside the program they belong to and the 'read'
    // privilege data
    // [out]    return: an associative array if there are any logs or NULL
    //          otherwise
    function selectAllWithReadPrivilege()
    {
        return parent::$dataBase->query(
            "SELECT 
                p.id AS program_id,
                p.name AS program_name,
                m.id AS module_id,
                m.name AS module_name,
                l.id AS log_id,
                l.name AS log_name,
                r.id AS privilege_id,
                r.name AS privilege_name
            FROM $this->table AS l
                INNER JOIN modules AS m
                    ON l.module_id = m.id 
                INNER JOIN programs AS p
                    ON m.program_id = p.id
                INNER JOIN `privileges` AS r
                    ON r.name = 'Read'
            WHERE 1
            ORDER BY p.id, m.id, l.id"
        )->fetchAll();
    }


    // Returns the ID of the log which has the specified program, module and 
    // log names
    // [in]     program: the name of the program which log we want to look for
    // [in]     module: the name of the module which log we want to look for
    // [in]     log: the name of the module that we want to look for
    function getIDByNames($program, $module, $log)
    {
        $rows = parent::select(
            "$this->table.id", 
            [
                'AND' => [
                    "$this->table.name" => $log,
                    'm.name' => $module,
                    'p.name' => $program
                ]
            ],
            [
                '[><]modules(m)' => [
                    "$this->table.module_id" => 'id'
                ],
                '[><]programs(p)' => [
                    'm.program_id' => 'id'
                ]
            ]
        );

        return (count($rows) > 0) ? $rows[0] : NULL;
    }


    // Returns an associative array which contains the info of all the logs 
    // in their respective module in their respective program
    function selectAll()
    {
        return parent::select(
            [
                'p.id(program_id)',
                'p.name(program_name)',
                'm.id(module_id)',
                'm.name(module_name)',
                "$this->table.id(log_id)",
                "$this->table.name(log_name)"
            ],
            [
                'ORDER' => [
                    'p.id', 'm.id', "$this->table.id"
                ]
            ],
            [
                '[><]modules(m)' => ['module_id' => 'id'],
                '[><]programs(p)' => ['m.program_id' => 'id']
            ]
        );
    }
}

?>