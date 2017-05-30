<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createAuthorizationReportService(
  'GMP',
  'Packing',
  'Daily Notice of Unusual Occurrence and Corrective Action Report',
  [
    'items_name' => 'items',
    'extra_info' => [
      // NULL
    ],
    'function' => function($scope, $segment, $logDate) {
      $entry = $scope->daoFactory->get('unusualOccurrence\Logs')
        ->selectByCaptureDateID($logDate['id']);
      $shifts = $scope->daoFactory->get('Shifts')->selectAll();

      $finalShifts = [];
      foreach ($shifts as $shift) {
        array_push($finalShifts, [
          'shift_id' => $shift['id'],
          'name' => $shift['name']
        ]);
      }

      return [
        'shifts' => $finalShifts,
        'entry' => $entry[0]
      ];
    }
  ]
);

?>