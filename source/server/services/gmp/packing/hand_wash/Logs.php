<?php

namespace fsm\database\gmp\packing\handWash;
require_once realpath(dirname(__FILE__).'/../../../../dao/LogTable.php');
use fsm\database as db;


// Interfaz para la tabla gmp_packing_hand_washing_log
class Logs extends db\LogTable
{
  // Crea una instancia de una interfaz a la base de datos para modificar 
  // la tabla gmp_packing_hand_washing_log
  function __construct() { 
    parent::__construct('gmp_packing_hand_washing_log');
  }

  // Retorna una lista de todos los renglones en la tabla que tengan asignado
  // el ID de la fecha de captura especificado
  // [in]   dateID (int): el ID de la fecha en que los datos fueron capturados
  //        en la base de datos
  // [out]  return (dictionary): un arreglo asociativo que contiene los datos
  //        de la tabla que tengan asignado el ID especificado organizados en
  //        renglones y columnas
  function selectByCaptureDateID($dateID) {
    return parent::$dataBase->query(
      "SELECT
        c.id AS id,
        c.name,
        is_acceptable
      FROM $this->table
      INNER JOIN gmp_packing_hand_washing_characteristics AS c
        ON $this->table.characteristic_id = c.id
      WHERE capture_date_id = $dateID"
    )->fetchAll();
  }

  // Modifica los valores de los renglones que cumplan con las condiciones 
  // especificadas
  // [in]   changes (dictionary): arreglo asociativo que describe los nuevos 
  //        valores a ser ingresados a la tabla
  // [in]   logID (uint): el ID de la bitacora cuyos datos van a ser modificados
  // [in]   characteristicID (uint): el ID de la caracteristica cuyos datos 
  //        van a ser modificados 
  // [out]  return (uint): el numero de renglones que fueron modificados
  function updateByCapturedLogIDAndCharacteristicID($changes, $logID, 
    $characteristicID) {
    return parent::update($changes, [
      'AND' => [
        'capture_date_id' => $logID,
        'characteristic_id' => $characteristicID
      ]
    ]);
  }
}

?>