<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createInventoryService(
  'GMP',
  'Packing',
  'Ozone Water Test Log',
  [
    // NULL
  ],
  function($scope, $request) {
    $segment = $scope->session->getSegment('fsm');
    return $scope->daoFactory->get('gmp\packing\ozone\Machines')
      ->selectAllByZoneID($segment->get('zone_id'));
  }
);

?>