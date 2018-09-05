<html>
<head>
<?php
	$random = mt_rand(1, 50); //Generate a random number between 1 and 50
	if (($random == 25) || ($_GET['ufo'] == 1)) { //If you hit the right number, of if you add ?ufo=1 to the url, include the script
		echo "<script src='ufo.js'></script>";
	}
?>
</head>
<body>
Normal, boring page.
</body>
</html>