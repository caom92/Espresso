<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');
use fsm;

$service = fsm\createReorderService(
  'GMP',
  'Packing',
  'Glass & Brittle Plastic Inspection',
  'gmp\packing\glass\AreaGlass'
);

?>