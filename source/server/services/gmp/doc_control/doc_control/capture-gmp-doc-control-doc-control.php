<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createCaptureService(
  'GMP',
  'Document Control',
  'Document Control',
  [
    // TO DO
  ],
  [
    'extra_info' => NULL
,    'function' => function($scope, $segment, $request, $logID) {
      // TO DO
    }
  ]
);

?>