/*	DRAW.js
 * 
 * 	Author: rszabad(si3ben)
 * 	Date: SS15, 8.6.15
 * 	Course: Test-driven Development mit JavaScript
 * 
 * 	Sammlung aller für die grafische Ausgabe direkt verantwortlichen Funktionen
 * 	
 * - drawButtons()
 * 		Erzeugt die zur Steuerung der Produktion und Schiffsverschiebungen genutzten Buttons an jedem Planeten.
 * 		Ruft sich bei Eingaben selbst wieder auf, um Änderungen zu visualisieren
 * 	
 *  -killElement(element)
 *  	Leert die Zeichenfläche, damit sie neu gezeichnet werden kann, indem das entsprechende Element gelöscht wird
 * 
 *  -shipsToText(planet)
 *  	Liest die auf Planeten vorhandenen Schiffe nach Spieler und Typ sortiert aus und gibt Sie als Feld zurück
 *  
 *  -DrawField(universe, milkyways)
 *  	-drawMilkyWays();  
 *		-drawPlanets();
 *  	
 *  	Zeichnet das Spielfeld aus Planeten und Routen
 */


//Buttons für Travel und Production
drawButtons = function(universe, milkyways){
	
	changeProduction = function(event){					//Fängt ID des gedrückten Buttons ab und ändert die Produktion am Planeten mit selber ID (zugehöriger Planet)
		
		this.universe[event.target.id].changeProduction();   
	}  
	
	settravelFrom = function(event){					//Fängt ID des gedrückten Buttons ab und trägt den startlaneten der Reise ein
		
		travelFrom = this.universe[event.target.id];
		drawButtons();
	}
	
	settravelTo = function(event){						//Fängt ID des gedrückten Buttons ab und trägt die Zielposition der Reise ein
		
		if(this.universe[event.target.id] != travelFrom){	//Ziel != start
			travelTo = this.universe[event.target.id];

			
			for(var y = 0; y < travelFrom.routesFromHere.length; y++){	//Durchgehen aller vom startplaneten ausgehenden Routen und heraussuchen der zu start und Ziel gehörigen
				if(travelFrom.routesFromHere[y].target== travelTo){
				var tempRoute = travelFrom.routesFromHere[y];			//zugehörige Route
				}
			}
			for(var x = 0; x < travelFrom.presentGroups.length; x++){	//Alle am startplaneten vorhandenen und zum Spieler gehörenden Gruppen werden auf die Route geschickt (sollte noch durch eine einstellbare Teilmenge erweitert werden)
				if(travelFrom.presentGroups[x].owner.ID == isPlayedBy){ 
					travelButtonPressed(travelFrom, tempRoute, isPlayedBy);
					//travelFrom.sendGroupOnTravel(travelFrom.presentGroups[x], tempRoute);
				}
			}
		}
		  
		travelFrom = undefined;		//Nullsetzen der start- und Zielvariablen
		travelTo = undefined;	
		drawButtons();				//Neuaufruf der Funktion um Veränderungen anzuzeigen
	}
	
	//Überlagernde Buttonarea erzeugen
	killElement(document.getElementById("buttonArea")); 	//Zeichenfläche für Buttons leeren
	
	var buttonArea = document.createElement("div");			//Grundlegende Eigenschaften der Zeichenfläche
	buttonArea.setAttribute("id", "buttonArea"); 
	buttonArea.style.width = "1000px";
	buttonArea.style.height = "600px";
	buttonArea.style.backgroundColor = "black";  	
	var empty = document.createTextNode(" "); 
	buttonArea.appendChild(empty);    
	document.body.appendChild(buttonArea);						
	
	for(var i = 0; i < this.universe.length; i++){					//Erzeugung der Buttons zu jedem Planeten
			 
	var btn = document.createElement("BUTTON");					
	btn.setAttribute("id", i);
	if(travelFrom == undefined ){											//Wenn noch kein startplanet ausgewählt, rufen Buttons die Funktion dafür auf
		if(isPlayedBy == this.universe[i].owner.ID){						//Buttons nur an Spielerplaneten
			var t = document.createTextNode(this.universe[i].planetID);        	
			btn.appendChild(t);   
			btn.onclick=function(){ settravelFrom(event); };
			buttonArea.appendChild(btn);
		}
	}
	else{																	//Wenn startplanet bereits ausgewählt, rufen Buttons die Funktion zum zuweisen des Zielplaneten auf
		for(var f = 0; f < travelFrom.routesFromHere.length; f++){ 			
			if(travelFrom.routesFromHere[f].target== this.universe[i]){			//Nur Buttons an infrage kommenden Zielplaneten werden angezeigt (Beschränkung durch Richtung der Routen)
				var t = document.createTextNode(this.universe[i].planetID);       
				btn.appendChild(t); 
				btn.onclick=function(){ settravelTo(event); };
				
				buttonArea.appendChild(btn); 
			}
		}
		
		
	}
	
	btn.style.width = "20px";				//Grundlegende Eigenschaften der Reise-Buttons
	btn.style.height = "20px";
	var ButtonX = this.universe[i].x - this.universe[i].mass*5 / 2 + this.universe[i].mass*5 + 5;	//Position mithilfe in Abhängigkeit von Planetenposition und dessen masse = Größe bestimmt
	ButtonX += "px";
	btn.style.left = ButtonX;
	var ButtonY = this.universe[i].y - this.universe[i].mass*5 / 2;
	ButtonY += "px";
	btn.style.top = ButtonY; 	
	btn.style.position = "absolute";
	
	
	var btn2 = document.createElement("BUTTON");	//Erzeugung und grundlegende Eigenschaften der Produktions-Veränderungs-Buttons
	btn2.setAttribute("id", i);
	
	btn2.onclick=function(){ changeProduction(event); };		
			
	btn2.style.width = "20px";
	btn2.style.height = "20px";
	var ButtonX = this.universe[i].x - this.universe[i].mass*5 / 2 - 25;
	ButtonX += "px";
	btn2.style.left = ButtonX;
	var ButtonY = this.universe[i].y - this.universe[i].mass*5 / 2;
	ButtonY += "px";
	btn2.style.top = ButtonY; 	
	btn2.style.position = "absolute";
	
	if(this.universe[i].owner.ID == isPlayedBy){	//Anfügen der Produktionsbuttons bei Planeten des jeweiligen Spielers
		buttonArea.appendChild(btn2); 
	}	
	} 

}

function killElement(element) {					//Löschen von Elementen
		 if (element) {
		  var dad = element.parentNode;			//Suchen des übergeordneten Elements
		  if (dad) dad.removeChild(element);    //Löschen des relativ untergeordneten Elements
		 }
		}

shipsToText = function (tempPlanet) {	//Ausgabe der Auf dem übergebenen Planeten befindlichen Gruppen nach Typ und Spieler sortiert als Text in einem Feld
	 	
	var ret = [];
	var shi = [0,0,0,0,0,0]
	for(var i = 0; i < tempPlanet.presentGroups.length; i++)
	{
		
		if(tempPlanet.owner.ID == 99){
		var ID0 = 1;
		}
		else{
			var ID0 = tempPlanet.owner.ID;
		}
		
		if(ID0 == tempPlanet.presentGroups[i].owner.ID){			
				if(tempPlanet.presentGroups[i].type == 1){shi[0] = shi[0] + tempPlanet.presentGroups[i].ships.length;}
				if(tempPlanet.presentGroups[i].type == 2){shi[1] = shi[1] + tempPlanet.presentGroups[i].ships.length;}
				if(tempPlanet.presentGroups[i].type == 3){shi[2] = shi[2] + tempPlanet.presentGroups[i].ships.length;}
		}
		else{
			if(tempPlanet.presentGroups[i].type == 1){shi[3] = shi[3] + tempPlanet.presentGroups[i].ships.length;}
			if(tempPlanet.presentGroups[i].type == 2){shi[4] = shi[4] + tempPlanet.presentGroups[i].ships.length;}
			if(tempPlanet.presentGroups[i].type == 3){shi[5] = shi[5] + tempPlanet.presentGroups[i].ships.length;}
		}
		
	}
	ret[0] = "" + shi[0] + " " + shi[1] + " " + shi[2];
	ret[1] = "" + shi[3] + " " + shi[4] + " " + shi[5];
	
	//In der 1. Reihe steht entweder der Besitzer des Planeten oder wenn dieser keinen hat, Spieler 1
	//Ausgabe in folgender Form: 	ret[0] = "Anzahl Spieler 1 / Typ1" + "Anzahl Spieler 1 / Typ2" + "Anzahl Spieler 1 / Typ3"	
								  //ret[1] = "Anzahl Spieler 2 / Typ1" + "Anzahl Spieler 2 / Typ2" + "Anzahl Spieler 2 / Typ3"	
	return ret;
	
	}

function drawField(universeA, milkywaysA){  	//Planeten, Routen, Textfelder einzeichnen
						
	this.milkyways = milkywaysA;
	this.universe = universeA;
	
	this.drawPlanets = function(){						//der Übersichtlichkeit halber als extra Funktion 
		for(var i = 0; i < this.universe.length; i++){
			
			//Schiffe zählen & zu Text
			var tempships = shipsToText(this.universe[i]);
				
			//Position & Größe & Beschriftung
			var PlanetID = "Planet" + i;
			var PlanetSize = this.universe[i].mass*5 + "px";				//Größe und Positionsoffset beeinflusst von Planetenmasse
			var PlanetX = this.universe[i].x - this.universe[i].mass*5 / 2;
			PlanetX += "px";
			var PlanetY = this.universe[i].y - this.universe[i].mass*5 / 2;
			PlanetY += "px";
			
			//Style-Angaben
			var drawPlanet = document.createElement("div");
			drawPlanet.setAttribute("id", PlanetID);
			drawPlanet.style.width = PlanetSize;
			drawPlanet.style.height = PlanetSize;					
			drawPlanet.style.left = PlanetX;
			drawPlanet.style.top = PlanetY; 	
			drawPlanet.style.position = "absolute";  	
			drawPlanet.style.backgroundColor = this.universe[i].owner.color;    			
			
			//Wenn Planet keinen Besitzer hat
			if(this.universe[i].owner.ID == 99){
				//Kein Besitzer, aber wird erobert
				if(this.universe[i].Conquest instanceof Conquest){
					//Einzeilige Anzeige vorhandener Schiffe bei Eroberung unter Planet
					var drawEnemies = document.createElement("div");	 	
					drawEnemies.style.height = "15px";							
					drawEnemies.style.left = PlanetX;
					PlanetY = this.universe[i].y - this.universe[i].mass*5 / 2 + 5 + this.universe[i].mass*5;
					PlanetY += "px";
					drawEnemies.style.top = PlanetY; 				
					drawEnemies.style.position = "absolute";  
					drawEnemies.style.backgroundColor = this.universe[i].presentGroups[0].owner.color;
								
					var result = Math.round((this.universe[i].Conquest.remainingConquestTime/1000) * 100) / 100;	//verbleibende Zeit bis zum Erfolg der Eroberung
							
					var newContent = document.createTextNode(tempships[0] + " " + result.toFixed(2)); //Nur 1. Reihe des Feldes wird ausgegeben, denn nur ein Spieler ist hier am Planeten ohne Besitzer
					drawEnemies.appendChild(newContent);
					drawingArea.appendChild(drawEnemies);  
									
				}	
				
				//Kein Besitzer, aber Kampf findet statt (Es sind beide Spieler am Planeten)
				if(this.universe[i].Fight instanceof Fight){
					//Einzeilige Anzeige vorhandener Schiffe bei Kampf unter Planet
					var drawEnemies = document.createElement("div");	 	
					drawEnemies.style.width = PlanetSize;
					drawEnemies.style.height = "15px";							
					drawEnemies.style.left = PlanetX;
					PlanetY = this.universe[i].y - this.universe[i].mass*5 / 2 + 5 + this.universe[i].mass*5;
					PlanetY += "px";
					drawEnemies.style.top = PlanetY; 				
					drawEnemies.style.position = "absolute";  
					drawEnemies.style.backgroundColor = "red";
					
					var newContent = document.createTextNode(tempships[0]);	
					drawEnemies.appendChild(newContent);
					drawingArea.appendChild(drawEnemies);  
					
					var drawEnemies = document.createElement("div");	 	
					drawEnemies.style.width = PlanetSize;
					drawEnemies.style.height = "15px";							
					drawEnemies.style.left = PlanetX;
					PlanetY = this.universe[i].y - this.universe[i].mass*5 / 2 + 5 + this.universe[i].mass*5 + 15;
					PlanetY += "px";
					drawEnemies.style.top = PlanetY; 				
					drawEnemies.style.position = "absolute";  
					drawEnemies.style.backgroundColor = "blue";
					
					var newContent = document.createTextNode(tempships[0]);
					drawEnemies.appendChild(newContent);
					drawingArea.appendChild(drawEnemies);  
				}	
			}
			
			else{//Wenn Planet einen Besitzer hat
				
				//Anzeige der Schiffe auf dem Planeten (Anzeige innerhalb der Planeten)
				var newContent = document.createTextNode(tempships[0]);
				drawPlanet.appendChild(newContent);
				var br = document.createElement("br"); 
				drawPlanet.appendChild(br);
				
				//Anzeige der Produktion auf dem Planeten
				if(this.universe[i].Production instanceof Production){
				
				var result = Math.round((this.universe[i].Production.remainingProductionTime/1000) * 100) / 100;
				
				
				var newContent = document.createTextNode(this.universe[i].typeOfProduction + " " + result.toFixed(2));	//Ausgabe der restlichen Produktionszeit
				drawPlanet.appendChild(newContent);
				}
				else{
					var newContent = document.createTextNode(this.universe[i].typeOfProduction + " -----");
					drawPlanet.appendChild(newContent);
				}
				
				if(this.universe[i].Conquest instanceof Conquest){
					
					//Einzeilige Anzeige vorhandener Schiffe bei Eroberung unter Planet
					var drawEnemies = document.createElement("div");	 	
					drawEnemies.style.height = "15px";							
					drawEnemies.style.left = PlanetX;
					PlanetY = this.universe[i].y - this.universe[i].mass*5 / 2 + 5 + this.universe[i].mass*5;
					PlanetY += "px";
					drawEnemies.style.top = PlanetY; 				
					drawEnemies.style.position = "absolute";  
					drawEnemies.style.backgroundColor = this.universe[i].presentGroups[0].owner.color;
								
					var result = Math.round((this.universe[i].Conquest.remainingConquestTime/1000) * 100) / 100;
					
					var newContent = document.createTextNode(tempships[1] + " " + result.toFixed(2));
					drawEnemies.appendChild(newContent); 
					drawingArea.appendChild(drawEnemies);  
									
				}	
				
				if(this.universe[i].Fight instanceof Fight){
					//Einzeilige Anzeige vorhandener Schiffe bei Kampf unter Planet
					var drawEnemies = document.createElement("div");	 	
					drawEnemies.style.width = PlanetSize;
					drawEnemies.style.height = "15px";							
					drawEnemies.style.left = PlanetX;
					PlanetY = this.universe[i].y - this.universe[i].mass*5 / 2 + 5 + this.universe[i].mass*5;
					PlanetY += "px";
					drawEnemies.style.top = PlanetY; 				
					drawEnemies.style.position = "absolute";  
					if(this.universe[i].owner.color.valueOf() == "red".valueOf()){
						drawEnemies.style.backgroundColor = "blue";
					}
					else
						{
							drawEnemies.style.backgroundColor = "red";
						}
					
					var newContent = document.createTextNode(tempships[1]);
					drawEnemies.appendChild(newContent);
					drawingArea.appendChild(drawEnemies);  				
				}			
			}
			drawingArea.appendChild(drawPlanet);  
		}
	}
	
	//Routen Einzeichnen
	this.drawMilkyWays = function(){	//der Übersichtlichkeit halber als extra Funktion 
		
		for(var i = 0; i < milkyways.length; i++){
			
			var RouteID = "Route" + i;
			var RouteSize = milkyways[i].distance + "px"; 	//grafische Länge der Route
			var RouteX = milkyways[i].start.x + "px";		//startpunkt der Route, nicht nach y ausgeglichen, da sich parallele Routen so nebeneinanderdrehen
			var RouteY = milkyways[i].start.y + "px";
			var angle  = Math.atan2(milkyways[i].target.y - milkyways[i].start.y, milkyways[i].target.x - milkyways[i].start.x) * 180 / Math.PI; //Berechnung des Winkels zwischen den beiden Planeten, die die Route verbindet
			
			var drawRoute = document.createElement("div");
			drawRoute.setAttribute("id", RouteID);
			drawRoute.style.width = RouteSize;
			drawRoute.style.height = "16px";
			
			drawRoute.style.transformOrigin = "0 0";				//Rotation der Route im den berechneten Winkel um Planeten optisch zu verbinden
			drawRoute.style.transform = "rotate(" + angle + "deg)";
			
			drawRoute.style.left = RouteX;
			drawRoute.style.top = RouteY; 
			
			drawRoute.style.position = "absolute";
			
			drawRoute.style.backgroundImage = "url('https://dl.dropboxusercontent.com/u/17359888/Arrows.png')";   //"gerichtetes" Hintergrundbild zur Anzeige der Richtung der Route
			drawRoute.style.backgroundPosition = "top left";
			drawRoute.style.backgroundRepeat = "repeat-x"; 
			
			drawRoute.style.backgroundColor = "#0066FF"; 
			var newContent = document.createTextNode(" "); 
			drawRoute.appendChild(newContent);    
			drawingArea.appendChild(drawRoute); 

			//Einzeichnen aller sich momentan auf der Route befindlichen Gruppen und ihrer Reisezeiten
			for(var n = 0; n < milkyways[i].travelers.length; n++){
			
				var drawtravelers = document.createElement("div");	 	
				drawtravelers.style.height = "15px";
				RouteSize = milkyways[i].distance/2 - 50 + "px";
				drawtravelers.style.left = RouteSize;
				var travelersTop = 20 * (n+1);
				travelersTop += "px";
				drawtravelers.style.top = "20px"; 
				drawtravelers.style.position = "relative";   
				drawtravelers.style.display="table";
				
				drawtravelers.style.transformOrigin = "50 50"; 
				drawtravelers.style.transform = "rotate(" + -angle + "deg)";
						 
				if(milkyways[i].travelers[n].presentGroup.owner.color.valueOf() == "red".valueOf()){
					drawtravelers.style.backgroundColor = "red"; 
				}
				else
					{
					drawtravelers.style.backgroundColor = "blue";  
					}
				 
				var result = Math.round((milkyways[i].travelers[n].remainingTravelTime/1000) * 100) / 100;
			
				var newContent = document.createTextNode("type " + milkyways[i].travelers[n].presentGroup.type + ": " + milkyways[i].travelers[n].presentGroup.ships.length + " " + result.toFixed(2));
				drawtravelers.appendChild(newContent); 
				drawRoute.appendChild(drawtravelers);     
				}
			
		}
	}
			
		//Zeichenfläche löschen
		killElement(document.getElementById("DrawingArea")); 
		
		//Zeichenfläche erzeugen
		var drawingArea = document.createElement("div");
		drawingArea.setAttribute("id", "DrawingArea");
		drawingArea.style.width = "1000px"; 
		drawingArea.style.height = "600px";
		drawingArea.style.backgroundColor = "black";  	
		var empty = document.createTextNode(" "); 
		drawingArea.appendChild(empty);   
		drawingArea.onselectstart=new Function ("return false"); 
		cont.appendChild(drawingArea); 
		
		//Routen einzeichnen 
		this.drawMilkyWays();  
		
		//Planeten einzeichnen
		this.drawPlanets();
					
		}

