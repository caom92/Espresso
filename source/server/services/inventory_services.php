<?php

namespace fsm\services\inventory;


$inventoryServices = [
    'get-areas-of-zone' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor']
        ],
        'callback' => 'fsm\services\inventory\getWorkingAreasOfZone'
    ], 
    'get-items-of-area' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor'],
            'area_id' => [
                'type' => 'int',
                'min' => 1
            ]
        ],
        'callback' => 'fsm\services\inventory\getItemsOfWorkingArea'
    ],
    'list-item-types' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor']
        ],
        'callback' => 'fsm\services\inventory\getAllItemTypes'
    ],
    'toggle-item-activation' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor'],
            'item_id' => [
                'type' => 'int',
                'min' => 1
            ]
        ],
        'callback' => 'fsm\services\inventory\toggleActivationOfItem'
    ],
    'add-new-inventory-item' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor'],
            'area_id' => [
                'type' => 'int',
                'min' => 1
            ],
            'type_id' => [
                'type' => 'int',
                'min' => 1
            ],
            'name' => [
                'type' => 'string',
                'max_length' => 64
            ]
        ],
        'callback' => 'fsm\services\inventory\addNewItem'
    ],
    'log-gmp-packing-preop' => [
        'requirements_desc' => [
            'logged_in' => ['Manager', 'Supervisor', 'Employee'],
            'has_privileges' => [
                'privilege' => ['Read', 'Write'],
                'program' => 'GMP',
                'module' => 'Packing',
                'log' => 'Pre-Operational Inspection'
            ]
        ],
        'callback' => 'fsm\services\inventory\getItemsOfZone'
    ],
    'change-order-of-item' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor'],
            'item_id' => [
                'type' => 'int',
                'min' => 1
            ],
            'position' => [
                'type' => 'int'
            ]
        ],
        'callback' => 'fsm\services\inventory\changeItemPosition'
    ],
    'add-workplace-area' => [
        'requirements_desc' => [
            'logged_in' => ['Supervisor'],
            'has_privileges' => [
                'privilege' => ['Read', 'Write'],
                'program' => 'GMP',
                'module' => 'Packing',
                'log' => 'Pre-Operational Inspection'
            ],
            'area_name' => [
                'type' => 'string'
            ]
        ],
        'callback' => 'fsm\services\inventory\addWorkingAreaToZone'
    ]
];


function addWorkingAreaToZone($scope, $request)
{   
    // get session segment
    $segment = $scope->session->getSegment('fsm');

    // insert the new area
    $id = $scope->workingAreas->insert([
        'zone_id' => $segment->get('zone_id'),
        'name' => $request['area_name']
    ]);

    return [
        'id' => $id,
        'name' => $request['area_name']
    ];
}


// Lists the areas of the specified zone
function getWorkingAreasOfZone($scope, $request) 
{
    $segment = $scope->session->getSegment('fsm');
    return $scope->workingAreas->selectByZoneID($segment->get('zone_id'));
}


// Lists the items in the specified area
function getItemsOfWorkingArea($scope, $request) 
{
    // first, get the items from the data base
    $rows = $scope->itemTypes->selectByAreaID($request['area_id']);

    // temporal storage for the items organized by type
    $types = [];

    // temporal storage for each individual type's items
    $type = [
        'id' => 0,
        'name' => '',
        'inventory' => []
    ]; 

    // visit each row obtained from the data base
    foreach ($rows as $item) {
        // check if this item belongs to a new type
        $hasTypeChanged = $type['id'] != $item['type_id'];
        if ($hasTypeChanged) {
            // if it does, check if the current accumulated items inventory is 
            // not empty
            if ($type['id'] != 0) {
                // if it is not, push it to the final storage
                array_push($types, $type);
            }

            // now save the current item's data
            $inventoryItem = [
                'id' => $item['id'],
                'is_active' => $item['is_active'],
                'position' => $item['position'],
                'name' => $item['name']
            ];

            // and create a new storage for the items of the new type pushing 
            // the current item to its inventory
            $type = [
                'id' => $item['type_id'],
                'name' => $item['type_name'],
                'inventory' => (isset($item['id'])) ? [
                    $inventoryItem
                ] : []
            ];
        } else {
            // if the type has not changed, push the current item to the 
            // current type's inventory
            array_push($type['inventory'], [
                'id' => $item['id'],
                'is_active' => $item['is_active'],
                'position' => $item['position'],
                'name' => $item['name']
            ]);
        }
    }

    // push the last item to the final storage
    if ($type['id'] != 0) {
        array_push($types, $type);
    }

    return $types;
}


// List all the item types
function getAllItemTypes($scope, $request)
{
    return $scope->itemTypes->selectAll();
}


// Toggles the activation of the specified item
function toggleActivationOfItem($scope, $request) 
{
    $scope->items->toggleActivationByID($request['item_id']);
}


// Adds a new inventory item to the specified area
function addNewItem($scope, $request) 
{
    // count the number of items in this area
    // so we can compute the position of this item and add it
    // in the last position
    $numItemsInArea = $scope->items->countByAreaAndTypeIDs(
        $request['area_id'],
        $request['type_id']
    );

    // store the item in the data base 
    return $scope->items->insert([
        'area_id' => $request['area_id'],
        'type_id' => $request['type_id'],
        'is_active' => TRUE,
        'position' => $numItemsInArea + 1,
        'name' => $request['name']
    ]);
}


// Changes the position of the specified item
function changeItemPosition($scope, $request)
{
    $scope->items->updatePositionByID(
        $request['item_id'], $request['position']);
}


// [***]
// Returns a list of all the items in a zone grouped by working areas and item 
// type
function getItemsOfZone($scope, $request)
{
    // get session segment
    $segment = $scope->session->getSegment('fsm'); 
    $rows = $scope->items->selectByZoneID($segment->get('zone_id'));

    // final array where the working areas are going to be stored
    $areas = [];

    // temporary storage for a single working area
    $area = [
        'id' => 0,
        'name' => '',
        'types' => []
    ];

    // temporary storage for a single item type
    $type = [
        'id' => 0,
        'name' => '',
        'items' => []
    ];

    // for each row obtained from the data base...
    foreach ($rows as $row) {
        // check if the working area has changed
        $hasAreaChanged = $row['area_id'] != $area['id'];
        if ($hasAreaChanged) {
            // if it has, first, check if the current working area info is not 
            // empty
            if ($area['id'] != 0) {
                // if it's not, then push it to the final array
                array_push($area['types'], $type);
                array_push($areas, $area);
            }

            // then, store the new item, item type and working area info in 
            // their corresponding temporal storage 
            $item = [
                'id' => $row['item_id'],
                'name' => $row['item_name'],
                'order' => $row['item_order']
            ];
            $type = [
                'id' => $row['type_id'],
                'name' => $row['type_name'],
                'items' => [ $item ]
            ];
            $area = [
                'id' => $row['area_id'],
                'name' => $row['area_name'],
                'types' => []
            ];
        } else {
            // if the current working area has not changed, check if the 
            // current item type group has
            $hasTypeChanged = $row['type_id'] != $type['id'];
            if ($hasTypeChanged) {
                // if it has, push the current item type info to the current 
                // working area temporal storage
                array_push($area['types'], $type);

                // then store the new item and item type info in their 
                // corresponding temporal storage
                $item = [
                    'id' => $row['item_id'],
                    'name' => $row['item_name'],
                    'order' => $row['item_order']
                ];
                $type = [
                    'id' => $row['type_id'],
                    'name' => $row['type_name'],
                    'items' => [ $item ]
                ];
            } else {
                // if the current item type info has not changed, then push the 
                // new item info to the current item type info temporal storage
                array_push($type['items'], [
                    'id' => $row['item_id'],
                    'name' => $row['item_name'],
                    'order' => $row['item_order']
                ]);
            }   // if ($hasTypeChanged)
        } // if ($hasAreaChanged)
    } // foreach ($rows as $row)

    // don't forget to push the last entries to the final array
    if ($type['id'] != 0) {
        array_push($area['types'], $type);
    }

    if ($area['id'] != 0) {
        array_push($areas, $area);
    }

    // return the resulting info
    return [
        'zone_name' => $segment->get('zone_name'),
        'program_name' => 'GMP',
        'module_name' => 'Packing',
        'log_name' => 'Pre-Operational Inspection',
        'areas' => $areas
    ];
}

?>