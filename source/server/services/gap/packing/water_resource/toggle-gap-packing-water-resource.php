<?php

require_once realpath(dirname(__FILE__).'/../../../service_creators.php');


$service = fsm\createToggleService(
  'GAP',
  'Fields',
  'Annual Water Resource Sanitary Survey Form',
  'gap\packing\waterResource\Items'
);

?>