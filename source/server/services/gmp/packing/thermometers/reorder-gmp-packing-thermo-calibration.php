<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createReorderService(
  'GMP',
  'Packing',
  'Daily Thermometer Calibration Verification Check',
  'gmp\packing\thermometers\Thermometers'
);

?>