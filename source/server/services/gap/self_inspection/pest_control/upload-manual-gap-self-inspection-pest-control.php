<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createUploadManualService(
  'GAP',
  'Self Inspection',
  'Pest Control & Log',
  'gap/self_inspection/pest_control/'
);

?>