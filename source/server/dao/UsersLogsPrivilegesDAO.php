<?php

// Namespace for the project's Data Access Objects
namespace fsm\database;

// Importing required classes
require_once realpath(dirname(__FILE__)."/DataAccessObject.php");

// Data Access Object for the users_logs_privileges table
class UsersLogsPrivilegesDAO extends DataAccessObject
{
    // Creates an interface for interacting with the 
    // users table in the specified data base
    function __construct()
    {
        parent::__construct("users_logs_privileges");
    }


    // Returns the privilege data about every module of the user with the 
    // especified ID in the form of an associative array
    // [in]     employeeNum: the employee ID number of the user which privileges
    //          we want to retrieve
    // [out]    return: an associative array if the user was found in the
    //          database or NULL otherwise; information is organized in a
    //          zone/program/module/privilege fashion
    function selectByEmployeeNum($employeeNum)
    {
        return parent::$dataBase->query(
            "SELECT 
                p.id AS program_id,
                p.name AS program_name,
                m.id AS module_id,
                m.name AS module_name,
                l.id AS log_id,
                l.name AS log_name,
                pr.id AS privilege_id,
                pr.name AS privilege_name 
            FROM $this->table 
                INNER JOIN users AS u
                    ON u.employee_num = $employeeNum
                INNER JOIN logs AS l 
                    ON $this->table.log_id = l.id 
                INNER JOIN modules AS m 
                    ON l.module_id = m.id 
                INNER JOIN programs AS p 
                    ON m.program_id = p.id 
                INNER JOIN privileges AS pr 
                    ON $this->table.privilege_id = 
                       pr.id 
            WHERE user_id = u.id
            ORDER BY p.id, m.id, l.id"
        )->fetchAll();
    }


    // Returns the list of modules which the user with the especified ID has 
    // access to only, ignoring all others, as an associative array
    // [in]     userID: the ID of the user which privileges we want to 
    //          retrieve
    // [out]    return: an associative array if the user was found in the
    //          database or NULL otherwise; information is organized in a
    //          program/module/privilege fashion
    function selectByUserID($userID)
    {
        return parent::$dataBase->query(
            "SELECT 
                p.id AS program_id,
                p.name AS program_name,
                l.id AS log_id,
                l.name AS log_name,
                m.id AS module_id,
                m.name AS module_name,
                r.id AS privilege_id,
                r.name AS privilege_name
            FROM $this->table AS t
                INNER JOIN logs AS l
                    ON l.id = t.log_id
                INNER JOIN modules AS m
                    ON m.id = l.module_id
                INNER JOIN programs AS p
                    ON p.id = m.program_id
                INNER JOIN privileges AS r
                    ON r.id = t.privilege_id
            WHERE t.user_id = '$userID' AND t.privilege_id != (
                SELECT id FROM privileges WHERE name = 'None'
            )
            ORDER BY p.id, m.id, l.id"
        )->fetchAll();
    }


    // Returns the list of modules which the user with the especified ID has 
    // access to only, ignoring all others, as an associative array and 
    // assigns them read privilege, ignoring their actual privilege
    // [in]     userID: the ID of the user which privileges we want to 
    //          retrieve
    // [out]    return: an associative array if the user was found in the
    //          database or NULL otherwise; information is organized in a
    //          program/module/privilege fashion
    function selectByUserIDWithReadPrivilege($userID)
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
            FROM $this->table AS t
                INNER JOIN logs AS l
                    ON l.id = t.log_id
                INNER JOIN modules AS m
                    ON m.id = l.module_id
                INNER JOIN programs AS p
                    ON p.id = m.program_id
                INNER JOIN privileges AS r
                    ON r.name = 'Read'
            WHERE t.user_id = '$userID' AND t.privilege_id != (
                SELECT id FROM privileges WHERE name = 'None'
            )
            ORDER BY p.id, m.id, l.id"
        )->fetchAll();
    }


    // Inserts the data to the data base
    // [in]    items: an array of associative arrays which define the rows to
    //         be inserted, where the key is the column name
    // [out]   return: the ID of the last inserted item
    function insert($items)
    {
        return parent::insert($items);
    }


    // Changes the privileges of the specified user for the specified log to 
    // the one specified
    // [in]     userID: the ID of the user which privileges are going to be 
    //          edited
    // [in]     logID: the ID of the log which privilege will be edited
    // [in]     privilegeID: the ID of the new privilege to be assigned
    // [out]    return: the number of affected rows
    function updatePrivilegeByUserAndLogID($userID, $logID, $privilegeID)
    {
        return parent::update(
            [
                'privilege_id' => $privilegeID
            ],
            [
                'AND' => [
                    'user_id' => $userID,
                    'log_id' => $logID
                ]
            ]
        );
    }
}

?>