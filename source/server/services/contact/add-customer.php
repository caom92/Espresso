<?php

$service = [
  'requirements_desc' => [
    'logged_in' => ['Administrator'],
    'company_name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'contact_name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'phone_num' => [
      'type' => 'phone'
    ],
    'email' => [
      'type' => 'email'
    ],
    'city' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'salesman' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ]
  ],
  'callback' => function($scope, $request) {
    $infoID = $scope->daoFactory->get('ContactInfo')->insert([
      'company_name' => $request['company_name'],
      'contact_name' => $request['contact_name'],
      'phone_num' => $request['phone_num'],
      'email' => $request['email']
    ]);

    return $scope->daoFactory->get('Customers')->insert([
      'contact_info_id' => $infoID,
      'city' => $request['city'],
      'salesman' => $request['salesman']
    ]);
  }
];

?>