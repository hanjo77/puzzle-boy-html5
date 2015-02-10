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
else {
	
	$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
	echo $level->load_level($id);
}

?>