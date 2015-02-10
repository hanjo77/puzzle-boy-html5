<?php

require_once("class.config.php");

/**
 * Class DBUtil - Database utility
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

/**
 * Class DBUtil - Database utility
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

class DBUtil {
	
	protected $self = array();
	private static $mysqli;
	private static $url;
	private static $db;
	private static $user;
	private static $password;
	private static $connection;

    /**
     * Initializes a new DBUtil class
     */
    public function __construct() {
		$this->url = SenkuShaConfig::$db["server"];
		$this->db = SenkuShaConfig::$db["name"];
		$this->user = SenkuShaConfig::$db["user"];
		$this->password = SenkuShaConfig::$db["password"];
    }

    /**
     * Connects to the database
     */
    function connect() {
		
		$this->mysqli = new mysqli($this->url, $this->user, $this->password, $this->db);

		/* check connection */
		if (mysqli_connect_errno()) {
		    printf("Connect failed: %s\n", mysqli_connect_error());
		    exit();
		}
	}

    /**
     * Executes a query on the database.
	 * Strings capsuled in triple square brackets will be escaped 
	 * against SQL injections
     * @param string $query SQL-query
     * @return array of objects
     */
	function query($query) {
	       
	  	$this->connect();
		$result = $this->mysqli->query($query);

		while($row = $result->fetch_assoc())
		{
			$rows[] = $row;
		}
				
		/* free result set */
		$result->close();

		/* close connection */
		$this->mysqli->close();
		
		return $rows;	
	}

    /**
     * Inserts into database.
	 * Strings capsuled in triple square brackets will be escaped 
	 * against SQL injections
     * @param string $query SQL-query
     * @return int ID
     */
    function insert($query) {
	       
	  	$this->connect();
		$query = preg_replace("/\[\[\[([^\]\]\]]*)\]\]\]/", mysql_real_escape_string("$1"), $query);
		$this->mysqli->query($query);
		mysql_query($query);
		$id = $this->mysqli->insert_id;
		$this->mysqli->close();
		return $id;	
	}
}

?>