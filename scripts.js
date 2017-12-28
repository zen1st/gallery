var navs = document.getElementById('navs');
var toggleMenuButton = document.querySelectorAll(".topnav .container")[0];

function toggleNav(x) {
    x.classList.toggle("change");
	
	if(navs.style.display == "none") {
		navs.style.display = "block";
	}
	else if(navs.style.display == "block"){
		navs.style.display = "none";
	}
	else {
		navs.style.display = "block";
	}
}

window.addEventListener('resize', function(event) {
	
	if(self.innerWidth > 600) {
		toggleMenuButton.classList.remove("change");
		navs.style.display = "block";
	}
	else {
		if(toggleMenuButton.classList.contains("change")) {
			navs.style.display = "block";
		}
		else {
			navs.style.display = "none";
		}
	}
});

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var openModalBtn = document.getElementById("myModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
openModalBtn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

var element = document.querySelector('.grid');

var shuffleInstance = new Shuffle(element, {
	itemSelector: '.column'
});

function filterCat(c) {
	var array = [];
	var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
	var uncheckboxes = document.querySelectorAll('input[type=checkbox]:not(:checked)');

	for (var i = 0; i < checkboxes.length; i++) { 
		array.push(checkboxes[i].value);
	}

	//console.log(array);

	if(array.length == 0) {	
		shuffleInstance.filter((Math.random() + 1).toString(36).substring(7));
	}
	else {
		shuffleInstance.filter(array);
	}
}

var cats = [];

function initThumbnails() {
	
	var thumbnail1 = new Thumbnail("Mountains", "https://www.w3schools.com/w3images/mountains.jpg", "nature", "Default Image Placeholder");
	var thumbnails = [];
	
	thumbnails.push(thumbnail1.html);
	
	if(localStorage.getObject("thumbnails") != null) {
		var storedThumbnails = localStorage.getObject("thumbnails");
		storedThumbnails.forEach(function (element) {
			//console.log(toDOM(element));
			thumbnails.push(toDOM(element));
		}, this);
	}
	
	
	thumbnails.forEach(function (element) {
		/\[(.*?)\]/g.exec(element.getAttribute("data-groups"))[1]
			.split(",")
			.map((item) => cats.indexOf(/"(.+)"$/g.exec(item)[1]) === -1 ? cats.push(/"(.+)"$/g.exec(item)[1]) : "");
		//console.log(cats);
		
		shuffleInstance.element.appendChild(element);
	}, this);
	
	cats.map((value) => document.getElementById("filterContainer").appendChild(new Checkbox(value).html));
	
	//console.log(shuffleInstance.element);
	
	shuffleInstance.add(thumbnails);
	
	shuffleInstance.update();
}

initThumbnails();

function addThumbnail() {
	var name = document.forms["addForm"]["name"].value;
	var src = document.forms["addForm"]["src"].value;
	var cat = document.forms["addForm"]["cat"].value;
	var desc = document.forms["addForm"]["desc"].value;
	
	var thumbnail = new Thumbnail(name, src, cat, desc);
	
	thumbnail.save();
	
	var thumbnails = new Array();
		
	thumbnails[0] = thumbnail.html;
		
	thumbnails.forEach(function (element) {
		
		/\[(.*?)\]/g.exec(element.getAttribute("data-groups"))[1]
			.split(",")
			.map((item) => cats.indexOf(/"(.+)"$/g.exec(item)[1]) === -1 ? 
										(cats.push(/"(.+)"$/g.exec(item)[1]),
										document.getElementById("filterContainer").appendChild(new Checkbox(/"(.+)"$/g.exec(item)[1]).html))
										: "");
		//console.log(shuffleInstance.element);
		//console.log(element);
		shuffleInstance.element.appendChild(element);
	}, this);
	
	shuffleInstance.add(thumbnails);
	
	shuffleInstance.update();
	
	//console.log(shuffleInstance);
	
	modal.style.display = "none";
	
	document.getElementById("addForm").reset();
	
	
	return false;
}

function removeThumbnail(evt) {
	
	// Bail in older browsers. https://caniuse.com/#feat=element-closest
	if (typeof event.target.closest !== 'function') {
		return;
	}
	var element = event.target.closest('.column');
	
	currentCats = [];
	
	/\[(.*?)\]/g.exec(element.getAttribute("data-groups"))[1]
			.split(",")
			.map((item) => currentCats.push(/"(.+)"$/g.exec(item)[1]));
		
	console.log("currentCats: "+currentCats);
	
	if (element !== null) {
		shuffleInstance.remove([element]);
	}
  
	if(localStorage.getObject("thumbnails") != null) {
		var storedThumbnails = localStorage.getObject("thumbnails");
		
		for(var i = 0; i<storedThumbnails.length; i++){
			if(evt.parentNode.parentNode.getAttribute("id") == toDOM(storedThumbnails[i]).getAttribute("id")){
				storedThumbnails.splice(i, 1); 
				
			}
		}
		localStorage.setObject("thumbnails", storedThumbnails);
	}
	
		
	shuffleInstance.element.childNodes.forEach(function(child){
		if(child.nodeType != 3 && child.nodeType != 8){
			/\[(.*?)\]/g.exec(child.getAttribute("data-groups"))[1]
				.split(",")
				.map((item) => currentCats.indexOf(/"(.+)"$/g.exec(item)[1]) === -1 ? 
											(console.log(/"(.+)"$/g.exec(item)[1])):"");
		}
	});
}

// Filter the shuffle instance by items with a title that matches the search input.
function handleSearchKeyup (evt)
{
	var searchText = evt.value.toLowerCase();
	//console.log(searchText);
	
	shuffleInstance.filter(function (element, shuffle) {
		var titleElement = element.querySelector('.content h4');
		var titleText = titleElement.textContent.toLowerCase().trim();

		return titleText.indexOf(searchText) !== -1;
	});
}

function handleSortChange(e) {
	var options;
	if (e){
		options = {by: sortByTitle};
	}
	else{
		options = {reverse: true, by: sortByTitle};
	}
	shuffleInstance.sort(options);
}

function sortByTitle(element) {
    return element.getAttribute('data-title').toLowerCase();
}

function loadImage(e){
	setTimeout(function(){
    	e.previousElementSibling.classList.remove("imgLoader");
    	e.style.opacity = 1;
        //e.parentElement.style.height = "auto";
        }, 1000);   
}
