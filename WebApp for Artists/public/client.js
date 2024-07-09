//from t9-demo
function createAccount(){
    let name = document.getElementById("name").value;
	let pass = document.getElementById("pass").value;
	let newUser = { username: name, password: pass };
	
	fetch(`http://localhost:3000/register`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			document.getElementById("name").value = '';
			document.getElementById("pass").value = '';
			alert("That username is taken. Please use a different username.");
        } else {
			location.href=`http://localhost:3000/`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));

}

//sends a PUT request to /byCategory with query string to query
function sameCategory(){
    let category = document.getElementById("category").value;
    console.log(category);
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            console.log(this.responseText);
            document.getElementById("resultCategory").innerHTML = this.responseText;
        }
        else if(this.status==404){
            alert("We couldn't find matching items.");
        }
    }
    
    req.open("GET", '/samecategory?'+'category='+category);
    req.setRequestHeader('Content-type', 'text/html'); 
    req.send();
}

//sends a PUT request to /byCategory with query string to query
function sameMedium(){
    let medium = document.getElementById("medium").value;
    console.log(medium);
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            console.log(this.responseText);
            document.getElementById("resultMedium").innerHTML = this.responseText;
        }
        else if(this.status==404){
            alert("We couldn't find matching items.");
        }
    }
    
    req.open("GET", '/samemedium?'+'medium='+medium);
    req.setRequestHeader('Content-type', 'text/html'); 
    req.send();
}

//put request to update user
function updateUser(){
    let username = document.getElementById("accountUsername").value;
    let accountType = document.getElementById("accountType").value;

    console.log(username);
    let sendContent = {};
    if(accountType === "Artist"){
        sendContent["artist"] = true;
    }
    else{
        sendContent["artist"] = false;
    }
    sendContent["username"] = username;


    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert("User info updated.")
            location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("Couldn't update user info.");
            location.reload();
        }
        else if(this.readyState == 4 && this.status == 505){
            alert("Please add one art to be an artist.");
            location.reload();
        }
    }

    req.open("PUT", '/user');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}

//post request to add art
function addArt(){
    let artName = document.getElementById("artName").value;
    let year = document.getElementById("year").value;
    let artistName = document.getElementById("artistName").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("image").value;
    sendContent = {};
    sendContent["artName"] = artName;
    sendContent["year"] = year;
    sendContent["artistName"] = artistName;
    sendContent["category"] = category;
    sendContent["medium"] = medium;
    sendContent["description"] = description;
    sendContent["image"] = image;

    console.log("HTHE");
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert("Added artwork")
            
        }
        else if(this.readyState==4 && this.status==404){
            alert("Couldn't add artwork.");
            
        }
        else if(this.readyState == 4 && this.status == 405){
            alert("Sorry you cannot add artwork because you are not an artist.")
           
        }
        else if (this.readyState == 4 && this.status == 403){
            alert("Sorry, an Artwork with the same name exists.")
            
        }
    }
    req.open("POST", '/addart');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}


//post request to add art
function addWorkshop(){
    let workshopTitle = document.getElementById("workshopTitle").value;
    sendContent = {};
    sendContent["workshopTitle"] = workshopTitle;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert("Added workshop")
            location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("Couldn't add workshop.");
            location.reload();
        }
    }
    req.open("POST", '/addworkshop');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}



function follow(){
    let artistId = document.getElementById("follow").value;
    sendContent = {}
    sendContent["artistId"] = artistId;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            //alert("Followed artist")
            location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("Couldn't follow artist.");
            location.reload();
        }
    }
    req.open("PUT", '/follow');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}

function unfollow(){
    let artistId = document.getElementById("unfollow").value;
    sendContent = {}
    sendContent["artistId"] = artistId;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            //alert("Unfollowed artist")
            location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("Couldn't unfollow artist.");
            location.reload();
        }
    }
    req.open("PUT", '/unfollow');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}

function registerWorkshop(){
    let workshopId = document.getElementById("registerWorkshop").value;
    sendContent = {}
    sendContent["workshopId"] = workshopId;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert("Registered to Workshop")
            location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("Couldn't register to Workshop.");
            location.reload();
        }
    }
    req.open("PUT", '/registerWorkshop');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));

}

function search(){
    let searchArtName = document.getElementById("searchArtName").value;
    let searchArtistName = document.getElementById("searchArtistName").value;
    let searchCategory = document.getElementById("searchCategory").value;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            console.log(this.responseText);
            document.getElementById("searchResult").innerHTML = this.responseText;

        }
        else if(this.readyState==4 && this.status==404){
            alert("error in searching result")
        }
    }
    req.open("PUT", '/search?'+'searchArtName='+searchArtName+'&searchArtistName='+searchArtistName+'&searchCategory='+searchCategory);
    req.setRequestHeader('Content-type', 'text/html'); 
    req.send();
}

function like(){
    let artId = document.getElementById('like').value;
    console.log(artId)
    sendContent = {};
    sendContent["artId"] = artId;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
           //alert("liked")
           location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("could not like")
            location.reload();
        }
    }
    req.open("PUT", '/like');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}

function unlike(){
    let artId = document.getElementById('unlike').value;
    console.log(artId)
    sendContent = {};
    sendContent["artId"] = artId;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
           //alert("unliked")
           location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("could not unlike")
            location.reload();
        }
    }
    req.open("PUT", '/unlike');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}

function review(){
    let artId = document.getElementById('review').value;
    let review = document.getElementById('reviewContent').value;
    console.log(artId)
    sendContent = {};
    sendContent["artId"] = artId;
    sendContent["review"] = review;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
           //alert("Review posted")
           location.reload();
        }
        else if(this.readyState==4 && this.status==404){
            alert("Could not post review")
            location.reload();
        }
    }
    req.open("POST", '/review');
    req.setRequestHeader('Content-type', 'application/json'); 
    req.send(JSON.stringify(sendContent));
}