<?php

require_once realpath(__DIR__.'/add-menu-item.php');

$arrayElementExists = function($array, $key) {
  return isset($array[$key]) && array_key_exists($key, $array);
};

$service = [
  'requirements_desc' => $requirementsDesc + [
    'url' => [
      'type' => 'string',
      'max_length' => 65535
    ]
  ],
  'callback' => $getAddMenuItemCallback('links', 
    function($request, $segment, $image, $scope) use ($arrayElementExists) {
    if ($arrayElementExists($request, 'parent_id')) {
      $parentId = (strlen($request['parent_id']) > 0) ?
        $request['parent_id'] : NULL;
    } else {
      $parentId = NULL;
    }

    return [
      'user_id' => $segment->get('user_id'),
      'parent_id' => $parentId,
      'type_id' => 2,
      'name' => $request['name'],
      'icon' => (isset($request['icon'])) ?
        $request['icon'] : NULL,
      'image' => $image,
      'url' => $request['url']
    ];
  })
];

?>