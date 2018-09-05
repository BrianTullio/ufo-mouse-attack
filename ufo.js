var ufo;
var circle_timer;
var circle = 0; //Keeps track of where on the circle the UFO currently is
var mouseX = -250; //If no mouse coordinates are available yet, set the last known position to off the screen
var mouseY = -250;
var blaster_count = 0; //So we don't created new blasters with existing ID's
var shots = new Array(); //Keeps all of the information related to the blaster shots (ID, last position, target position, etc.)
var ufo_img = "ufo.gif"; //Path to image used for the UFO - can be an animated GIF
var blaster_shot_img = "blaster_shot.png"; //Path to the image used for the blaster shot
var blast_img = "blast.gif"; //Path to the image used for the explosion when the blaster hits the target position
var ufoX = 0; //Current position of the UFO in pixels from the upper-left hand of the page
var ufoY = 0;

document.onmousemove = track; //Runs the track function to grab a copy of the mouse position

setTimeout(initUFO,1800000); //Delay the process - Intended to be used as an easter egg. (UFO shows if you stay on the same page for 30 minutes...)


function track(event) {
	mouseX = event.pageX - 20; //Offset the position by 20 pixels so it's more towards the pointer tip
	mouseY = event.pageY - 20;
}

function plotCircle() {
	xDiff = ufoX - (mouseX); //Difference between the mouse position and the current UFO position
	yDiff = ufoY - (mouseY);
	
	ufoX = ufoX - (xDiff / 25); //Applies an elastic effect to the UFO so it moves faster the further away it is
	ufoY = ufoY - (yDiff / 25);
	
	circle = (circle + .3) % 360; //Moves a point along a circle at a certain rate
	offsetX =  Math.cos(circle) * 50; //Translates that point into a XY offset
	offsetY =  Math.sin(circle) * 50;
	
	ufo_currentX = ufoX + offsetX; //Apply that offset to the UFO position and save it
	ufo_currentY = ufoY + offsetY;
	
	ufo.style.left = ufo_currentX; //Actually move the UFO
	ufo.style.top = ufo_currentY;
}

function fireBlaster() {
	b = document.createElement('img'); //Create a new element for the blaster image
	b.setAttribute("id", "blaster_shot_" + blaster_count); //Set a unique ID
	b.setAttribute("src", blaster_shot_img); //Add image
	b.setAttribute("style", "position:absolute;top:" + ufo_currentY + ";left:" + ufo_currentX + ";"); //Set origin position to the position of the UFO when it was fired
	document.body.appendChild(b); //Add the new elemtnt to the DOM
	shot_angle = Math.atan2((mouseY + 15) - ufo_currentY, (mouseX + 15) - ufo_currentX) * 180 / Math.PI; //Figure out the angle of the shot based on where it started and where it is going (mouse position)
	shots[blaster_count] = [blaster_count,ufo_currentX,ufo_currentY,mouseX + 15,mouseY + 15,0,shot_angle]; //Save all of that info to the shots array
	blaster_count = (blaster_count + 1) % 15; //Increment the blaster count, resetting after 15 since we won't ever have more than that on the screen at one time
}

function moveBlaster() { //Moves each blaster at a certain speed at the angle it needs, removes it when it has reached its destination
	for (shot of shots) { //Iterate through each shot in the array
		if (document.getElementById("blaster_shot_" + shot[0])) { //Make sure the shot exists
			shot_img = document.getElementById("blaster_shot_" + shot[0]); //Grab the element
			
			move_hereX = Math.cos((shot[6])*Math.PI/180) * 20 + shot[1]; //Calculate the new shot position based on angle [6], speed (20 pixels), and current shot position [1,2]
			move_hereY = Math.sin((shot[6])*Math.PI/180) * 20 + shot[2];
			
			shot_img.style.top = move_hereY; //Move the shot element
			shot_img.style.left = move_hereX;
			
			shots[shot[0]][1] = move_hereX; //Save the new shot position to the array
			shots[shot[0]][2] = move_hereY;
			shots[shot[0]][5] = shot[5] + 1; //Increment the shot timeout (in case something goes wrong)
			
			var d = new Date(); //Grab current date/time to use as a cache buster
			var n = d.getTime();
			
			//There is probably a less redundant way of doing this section...
			if (((shot_angle + 360) % 360) < 180) { //Make shot angle a positive number and check if it is angled up or down
				if (shot[2] > shot[4]) { //If angle is up, check if shot X is greater than target X
					shot_img.parentNode.removeChild(shot_img); //Remove blaster shot image
					b = document.createElement('img'); //Create new explosion element
					b.setAttribute("id", "blaster_exp" + n);
					b.setAttribute("src", blast_img + "?" + n); //Add cache buster so he browser doesn't reuse the same animation. Otherwise, all of the explosion animations will be in sync instead of starting at the point of impact
					b.setAttribute("style", "position:absolute;top:" + shot[4] + ";left:" + shot[3] + ";"); //Place explosion at the target position
					document.body.appendChild(b); //Add element to the DOM
					setTimeout(removeBlast, 1000, n); //Remove the explosion animated after 1 second
				}
			} else {
				if (shot[2] < shot[4]) { //If angle is down, check if shot X is less than target X
					shot_img.parentNode.removeChild(shot_img); //Remove blaster shot image
					b = document.createElement('img'); //Create new explosion element
					b.setAttribute("id", "blaster_exp" + n);
					b.setAttribute("src", blast_img + "?" + n); //Add cache buster so he browser doesn't reuse the same animation. Otherwise, all of the explosion animations will be in sync instead of starting at the point of impact
					b.setAttribute("style", "position:absolute;top:" + shot[4] + ";left:" + shot[3] + ";"); //Place explosion at the target position
					document.body.appendChild(b); //Add element to the DOM
					setTimeout(removeBlast, 1000, n); //Remove the explosion animated after 1 second
				}
			}
		}
	}
}

function removeBlast(blast_id) {
	exp = document.getElementById("blaster_exp" + blast_id); //Remove the explosion element
	exp.parentNode.removeChild(exp);
}

function initUFO() {
	b = document.createElement('img'); //Create the UFO element
	b.setAttribute("id", "ufo");
	b.setAttribute("src", ufo_img);
	b.setAttribute("style", "position:absolute;top:-250;left:-250;"); //Set the default position to off screen
	document.body.appendChild(b); //Add the element to the DOM
	
	ufo = document.getElementById("ufo");
	console.log("Init - UFO");
	circle_timer = setInterval(plotCircle,100); //Moves the UFO around the circle every 1/10 second (Gives the path a more "natural" feeling
	blaster_mover_timer = setInterval(moveBlaster,100); //Moves the blaster every 1/10 second
	blaster_timer = setInterval(fireBlaster,1000); //Fires the blaster every 1 second
}