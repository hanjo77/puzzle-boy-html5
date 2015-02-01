<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=0.6">
		<title>Puzzle Boy</title>
		<link href="css/puzzle-boy.css" type="text/css" rel="stylesheet"></link>
		<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="js/puzzle-boy.js"></script>
	</head>
	<body>
		<div class="contentWrapper">
			<img src="img/potato.png" class="potato" />
			<img src="img/eggplant.png" class="eggplant" />
			<img src="img/carrot.png" class="carrot" />
			<img src="img/pepper.png" class="pepper" />
			<div class="levelFinished">
				<h1>Well done!</h1>
				<?php
				
					$moves = isset($_GET["moves"]) ? $_GET["moves"] : "0";
					$time = isset($_GET["time"]) ? $_GET["time"] : "0:00";
				
				?>
				<table>
					<tr>
						<th>Moves:</th>
						<td><?= $moves ?></td>
					</tr>
					<tr>
						<th>Time:</th>
						<td><?= $time ?></td>
					</tr>
				</table>
			</div>
		</div>
	</body>
</html>