<?php

header('Content-Type: text/json; charset=utf-8');
require_once("inc/class.config.php");
require_once("inc/class.db_util.php");
require_once("inc/class.level.php");

$level = new Level();
if (isset($_GET["origin"])) {
	
	echo $level->get_difficulties($_GET["origin"]);
}

?>