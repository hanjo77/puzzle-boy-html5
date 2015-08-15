<?php
/**
 * Configuration settings for Senku-Sha
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

class SenkuShaConfig {

    public $self = array();

    // Database server connection settings

    public static $db = array(

        "server" => "127.0.0.1",
        "name" => "puzzle-boy",
        "user" => "root",
        "password" => "sheriff"
    );

    // Email server connection settings

    public static $mail = array(

        "server" => "ssl://smtp.gmail.com",
        "user" => "senkushagame@gmail.com",
        "password" => "53nku-5h4",
        "address" => "senkushagame@gmail.com"
    );

}
