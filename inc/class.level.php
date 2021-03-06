<?php
/**
 * Class Level - Handles various level operations
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.db_util.php");

/**
 * Class Level - Handles various level operations
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
class Level {
	
	protected $self = array(); 
	
	private static $id;

    /**
     * Initializes a new level
     * @param int $levelId ID of the level
     */
    public function __construct() {
		
    }

    /**
     * Returns the level JSON data
     * @param int $id Level ID
     * @return string Level ASCII string data
     */
    function load_level($id) {
	
		$data = array();
		$id_condition = "";
		if ($id > 0) {
			
			$id_condition = "where l.id = ".$id;
		}
		$db_util = new DBUtil();
		$query = "select `l`.`id`, `l`.`data`"
					." from level `l`"
					.$id_condition;
		/* $query = "select `l`.`id`, `o`.`name` `origin`, `d`.`name` `difficulty`, `lo`.`number` `number`, `l`.`data`"
			." from level `l`"
			." inner join `level_origin` `lo` on `lo`.`level_id` = `l`.`id`"
			." inner join `origin` `o` on `lo`.`origin_id` = `o`.`id`"
			." inner join `difficulty` `d` on `lo`.`difficulty_id` = `d`.`id`"
			.$id_condition
			." order by `d`.`id`, `lo`.`number`"; */
		if ($id > 0) {
			
			return json_encode($db_util->query($query)[0], JSON_UNESCAPED_UNICODE);
		}
		else {
			
			return json_encode($db_util->query($query), JSON_UNESCAPED_UNICODE);
		}
	}

    /**
     * Returns the level JSON data
     * @param int $id Level ID
     * @return string Level ASCII string data
     */
    function save_level($data, $creator, $active, $id) {
	
		$id_condition = "";
		$db_util = new DBUtil();
		if ($id > 0) {
			
			$query = "update `level` set `data` = '".$data."' where `id` = ".$id;
		}
		else {
			
			$query = "insert into `level` (`data`, `creator`, `active`)"
				." values ('".$data."', ".$creator.", ".$active.")";
		}
		return json_encode($db_util->insert($query));
	}
	
	function get_games() {
		
		$data = array();
		$db_util = new DBUtil();
		$query = "select `o`.`id`, `o`.`name`, `o`.`background`"
					." from origin `o`";
		
		return json_encode($db_util->query($query), JSON_UNESCAPED_UNICODE);
	}
	
	function get_difficulties($origin_id) {
		
		$data = array();
		$db_util = new DBUtil();
		$query = "select distinct `d`.`id`, `d`.`name`"
					." from difficulty `d`"
					." inner join level_origin `lo` on `lo`.`difficulty_id` = `d`.`id`"
					." where `lo`.`origin_id` = ".$origin_id
					." order by `d`.`id`";
		
		return json_encode($db_util->query($query), JSON_UNESCAPED_UNICODE);
	}
	
	function get_levels($origin_id, $difficulty_id) {
		
		$data = array();
		$condition = "";
		if (isset($origin_id)) {
			
			$condition = " where `o`.`id` = ".$origin_id;
			if (isset($difficulty_id)) {
				
				$condition .= " and `d`.`id` = ".$difficulty_id;
			}
		}
		$db_util = new DBUtil();
		$query = "select `l`.`id`, `o`.`name` `origin`, `d`.`name` `difficulty`, `lo`.`number` `number`, `l`.`data`"
			." from level `l`"
			." inner join `level_origin` `lo` on `lo`.`level_id` = `l`.`id`"
			." inner join `origin` `o` on `lo`.`origin_id` = `o`.`id`"
			." inner join `difficulty` `d` on `lo`.`difficulty_id` = `d`.`id`"
			.$condition
			." order by `d`.`id`, `lo`.`number`";
		
		return json_encode($db_util->query($query), JSON_UNESCAPED_UNICODE);
	}
}

?>