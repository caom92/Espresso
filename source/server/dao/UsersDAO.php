<?php

// Namespace for the project's Data Access Objects
namespace fsm\database;

// Importing required classes
require_once realpath(dirname(__FILE__)."/DataAccessObject.php");

// Data Access Object for the users table
class UsersDAO extends DataAccessObject
{
    // Creates an interface for interacting with the 
    // users table in the specified data base
    function __construct($dataBaseConnection)
    {
        parent::__construct($dataBaseConnection, "users");
    }
    

    // Returns an associative array containing the data of the which
    // has the especified identifier; it can also search for an 
    // identifier and password combination
    // [in]     identifier: the identifier of the element that we want 
    //          to look for; in this case, this can be either the ID, the
    //          user name, the employee number or the email
    // [in]     [password]: sha256-md5 checksum of the password that we want to
    //          search for in the table
    // [out]    return: an associative array with the data of the element
    //          that contained the especified identifier and password 
    //          combination, or an empty string in case none was found
    function selectByIdentifier($identifier, $password = NULL)
    {
        if (isset($password)) {
            return parent::select("*", [ "AND"  => [
                "OR" => [
                    "id" => $identifier,
                    "employee_num" => $identifier,
                    "email" => $identifier,
                    "login_name" => $identifier
                ],
                "login_password" => $password
            ]]);
        } else {
            return parent::select("*", [ "OR" => [
                "id" => $identifier,
                "employee_num" => $identifier,
                "email" => $identifier,
                "login_name" => $identifier
            ]]);
        }
    }
    
    
    // Inserts the data to the data base
    // [in]    items: an array of associative arrays which define the rows to
    //         be inserted, where the key is the column name
    // [out]   return: the ID of the last inserted item
    function insert($items)
    {
        return parent::insert($items);
    }


    // Changes the login password field of the element in the table which has 
    // the especified user ID
    // [in]     id: the user ID of the elemente which login password we 
    //          want to change
    // [in]     newPassword: the new password value that is to be assigned
    //          to the element found
    // [out]    return: the number of rows affected
    function updatePasswordByUserID($id, $newPassword)
    {
        return parent::update(
            [ "login_password" => $newPassword ], 
            [ "id" => $id ]
        );
    }


    // Changes the email field of the element in the table which has the 
    // especified user ID
    // [in]     id: the user ID of the elemente which email we 
    //          want to change
    // [in]     newEmail: the new email value that is to be assigned
    //          to the element found
    // [out]    return: the number of rows affected
    function updateEmailByUserID($id, $newEmail)
    {
        return parent::update(
            [ "email" => $newEmail ],
            [ "id" => $id ]
        );
    }


    // Changes the login name field of the element in the table which has the 
    // especified user ID
    // [in]     id: the user ID of the elemente which login name we 
    //          want to change
    // [in]     newName: the new login name value that is to be assigned
    //          to the element found
    // [out]    return: the number of rows affected
    function updateLogInNameByUserID($id, $newName)
    {
        return parent::update(
            [ "login_name" => $newName ],
            [ "id" => $id ]
        );
    }
}

?>