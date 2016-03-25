<?php

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    require_once dirname(__FILE__)."\\..\\dao\\users.php";
    require_once dirname(__FILE__)."\\..\\dao\\usersProfileInfo.php";
}
else {
    require_once dirname(__FILE__)."/../dao/users.php";
    require_once dirname(__FILE__)."/../dao/usersProfileInfo.php";
}

// Data is sent to the server from the client in the form of a JSON with
// the following format:
// {
//     employee_id:[uint]
//     full_name:[string]
//     email:[string]
//     login_name:[string]
//     login_password:[string]
//     permissions:[array<area_permission>]
// }
// where area_permission is:
// {
//     zone_id:[uint]
//     program_id:[uint]
//     permission_id:[uint]
// }
// we must decode it
$inputJSON = json_decode($_GET);

try {
    // attempt to connect to the data base
    $dataBaseConnection = connectToDataBase();
    $usersProfileInfoTable = new UsersProfileInfo($dataBaseConnection);
    $usersTable = new Users($dataBaseConnection);
    
    // save the new user profile data and store the resulting ID
    $userID = $usersProfileInfoTable->saveItems([[
        "employee_id_num" => $inputJSON["employee_id"],
        "full_name" => $inputJSON["full_name"],
        "email" => $inputJSON["email"],
        "login_name" => $inputJSON["login_name"],
        "login_password" => $inputJSON["login_password"]
    ]]);
    
    // now create the final array for storing the permissions in the
    // users data base
    $newPermissions = []; 
    foreach ($inputJSON["permissions"] as $permission) {
       array_push($newPermissions, [
           "profile_info_id" => $userID,
           "company_zone_id" => $permission["zone_id"],
           "certification_program_id" => $permission["program_id"],
           "access_permission_id" => $permission["permission_id"]
       ]); 
    }
    
    // save the resulting set of permissions in the data base 
    $usersTable->saveItems($newPermissions);
}
catch (Exception $e) {
    displayErrorPageAndExit($e->getCode(), $e->getMessage());
}

// return a success code just to let the client know
echo json_encode([
    "error_code" => 0,
    "error_message" => "Éxito",
    "data" => []
]);


?>