<?php

namespace fsm\database\capa;
require_once realpath(dirname(__FILE__).'/../../dao/InsertableTable.php');
use fsm\database as db;

class Logs extends db\InsertableTable
{
  function __construct() { 
    parent::__construct('capa_form');
  }

  // recuperar todas las bitácoras abiertas en la zona
  function selectOpenByZoneID($zoneID) {

  }

  // recuperar los datos de una sola bitácora
  function selectByLogID($logID) {
    return parent::select(
      [
        "$this->table.id",
        'capa_number',
        'reference_number',
        'creator_id',
        'c.first_name(creator_first_name)',
        'c.last_name(creator_last_name)',
        'capture_date',
        'reference',
        'description',
        'observer',
        'occurrence_date',
        'findings',
        'root_cause',
        'preventive_actions',
        'corrective_actions',
        'planned_date',
        'assigned_personnel',
        'follow_up',
        'actual_date',
        'status',
        'accepter_id',
        'a.first_name(accepter_first_name)',
        'a.last_name(accepter_last_name)',
        'closure_date',
        'link(url)'
      ],
      [
        "$this->table.id" => $logID
      ],
      [
        '[><]users(c)' => [
          'creator_id' => 'id'
        ],
        '[>]users(a)' => [
          'accepter_id' => 'id'
        ]
      ]
    );
  }

  function selectCapturingByZoneID($zoneID) {
    return parent::select(
      [
        "$this->table.id",
        'capa_number',
        'reference_number',
        'c.first_name(creator_first_name)',
        'c.last_name(creator_last_name)',
        'capture_date'
      ],
      [
        'AND' => [
          "$this->table.zone_id" => $zoneID,
          'accepter_id' => null 
        ]
      ],
      [
        '[><]users(c)' => [
          'creator_id' => 'id'
        ]
      ]
    );
  }
}

?>