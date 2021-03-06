<?php

$service = [
  'requirements_desc' => [
    'logged_in' => ['Supervisor', 'Employee']
  ],
  'callback' => function($scope, $request) {
    $segment = $scope->session->getSegment('fsm');
    return $scope->daoFactory->get('gap\packing\preop\WorkingAreas')
      ->selectByZoneIDOrderedByName($segment->get('zone_id'));
  }
];

?>