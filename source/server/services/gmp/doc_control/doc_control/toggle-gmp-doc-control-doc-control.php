<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createToggleService(
  'GMP',
  'Document Control',
  'Document Control',
  'gmp\docControl\docControl\Documents'
);

?>