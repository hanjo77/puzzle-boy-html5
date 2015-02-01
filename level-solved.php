
		<div class="contentWrapper">
			<?php
				
				if (isset($_GET["potato"])) {
			
			?>
			<img src="img/potato.png" class="potato" />
			<?php
				
				}
				if (isset($_GET["eggplant"])) {
			
			?>
			<img src="img/eggplant.png" class="eggplant" />
			<?php
				
				}
				if (isset($_GET["carrot"])) {
			
			?>
			<img src="img/carrot.png" class="carrot" />
			<?php
				
				}
				if (isset($_GET["pepper"])) {
			
			?>
			<img src="img/pepper.png" class="pepper" />
			<?php
				
				}
			
			?>
			<div class="content">
				<h1>Well done!</h1>
				<?php
				
					$moves = isset($_GET["moves"]) ? $_GET["moves"] : "0";
					$time = isset($_GET["time"]) ? $_GET["time"] : "0:00";
					$level = isset($_GET["level"]) ? $_GET["level"] : 0;
				
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
				<div class="buttons">
					<a class="btnRetry" href="#level<?= $level ?>">Retry</a>
					<a class="btnContinue" href="#level<?= ($level+1)?>">Continue</a>
				</div>
			</div>
		</div>
