<?php

require_once("inc/class.config.php");
require_once("inc/class.db_util.php");
require_once("inc/class.level.php");

$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
$level = new Level();
echo $level->load_level($id);

?>