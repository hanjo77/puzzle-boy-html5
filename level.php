<?php

header('Content-Type: text/json; charset=utf-8');
require_once("inc/class.config.php");
require_once("inc/class.db_util.php");
require_once("inc/class.level.php");

$level = new Level();
if (isset($_POST["data"])) {
	
	$id = 0;
	if (isset($_POST["id"])) {
		
		$id = $_POST["id"];
	}
	echo $level->save_level($_POST["data"], 1, 0, $id);
}
else if (isset($_GET["id"])) {
	
	echo $level->load_level((int)$_GET["id"]);
}
else if (isset($_GET["origin"]) && isset($_GET["difficulty"])) {
	
	echo $level->get_levels($_GET["origin"], $_GET["difficulty"]);
}

?>