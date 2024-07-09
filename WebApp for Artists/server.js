//Create express app
const express = require('express');
let app = express();

//requiring express-session
const session = require('express-session');

//logger
const logger = require('morgan');
app.use(logger('dev'));

//require mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

//require model
const Art = require("./model/ArtModel.js");
const User = require("./model/UserModel.js");
const Workshop = require("./model/WorkshopModel.js");
const Review = require('./model/ReviewModel.js');

//setting pug 
app.set('views', './views');
app.set('view engine', 'pug');


//Converts any JSON stringified strings in a POST request to JSON.
//telling express that we can access the parameters in the route by just accessing req.body.anything
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));

//static file
app.use(express.static('public'));

// Use the session middleware
app.use(session({ 
	secret: 'secret', 
	resave: true,
	saveUninitialized: true
})); 

//render home page
app.get('/', (req, res)=>{
    res.render('home',{ session: req.session });
})


//render user account page
app.get('/user',(req,res)=>{
    if(req.session.loggedin == true){
        //console.log(req.session.userid);
        let obj_id = new ObjectId(req.session.userid)
        //console.log(obj_id);
         User.findById(obj_id).populate("following").populate("followers").populate("art").populate("like").populate("reviews")
        .exec(function(err,searchResult){
        if (err) {throw err};
        if(searchResult === null){
            res.send('notFound');
        }
        else{
          //  console.log(searchResult);
            //render the page, with the updated rating
            res.render('user', {user: searchResult, session:req.session});
        }
        })
    }
})

//load artlist page
app.get('/art',(req,res)=>{
    if(req.session.loggedin == true){
        Art.find({},function(err,result){
            if(err) throw err;
            else{
                //console.log(result);
                res.render('artlist', {session:req.session, arts:result})
            }
        })
    }
})

//show art work page
app.get('/art/:artId',(req,res)=>{
    if(req.session.loggedin == true){
    // console.log(req.params.artId);
        let isFollowing = false;
        let hasliked = false;
        let obj_id = new ObjectId(req.params.artId);
        Art.findById(obj_id)
        .populate("artist")
        .populate("like")
        .populate("reviews")
        .exec(function(err,searchResult){
            if (err) {throw err};
            if(searchResult === null){
                res.render('notFound');
            }
            else{
                console.log(searchResult);
                //render the page, with the updated rating
                res.render('art', {art: searchResult, session:req.session});
            }
        })
    }
})


//put account page for account user update 
app.put('/user',(req,res)=>{
    if(req.session.loggedin == true){
        //console.log(req.session.userid);
        let username = req.body.username;
        let artist = req.body.artist;
        let obj_id = new ObjectId(req.session.userid)
        // console.log(obj_id);
        // console.log(username);
        // console.log(artist);
        
        User.findOne({_id:obj_id},function(err,searchResult){
            if(searchResult.art.length == 0){
                res.status(505).send();
            }
            else{
                User.findOneAndUpdate({_id:obj_id},{username:username, artist:artist},function(err,searchResult){
                    if (err) {throw err};
                    if(searchResult === null){
                        res.send('notFound');
                    }
                    else{
                    // console.log(searchResult);
                        if(artist === true){
                            req.session.artist = true;
                        }
                        else{
                            req.session.artist = false;
                        }
                        res.render('user', {user: searchResult, session:req.session});
                    }
                })
            }
        })
    }
})


//get a list of artist 
app.get('/artist',(req,res)=>{
    if(req.session.loggedin == true){
        User.find().where('artist').equals(true)
        .exec(function(err,result){
            if(err) throw err;
            else{
                //console.log(result);
                res.render('artistList',{session:req.session, artists:result})
            }
        })
    }
})


//get info of an individual artist
app.get('/artist/:artistId',(req,res)=>{
    if(req.session.loggedin == true){
        //console.log(req.params.artistId);
        let artist_id = new ObjectId(req.params.artistId);
        let user_id = new ObjectId(req.session.userid);
        User.findById(artist_id).populate("art").populate("followers").populate("following").populate("workshopOrganize")
        .populate("like")
        .populate("reviews")
        .exec(function(err,searchResult){
            if (err) {throw err};
            if(searchResult === null){
                res.render('notFound');
            }
            else{
                //console.log("artistid")
                console.log(searchResult);
                res.render('artist', {artist: searchResult, session:req.session});
            }
        })
    }
})


//get the category of the artworks with the same category and load partial pug page
app.get('/samecategory',(req,res)=>{
    if(req.session.loggedin == true){
        //console.log(req.query.category);
        let category = req.query.category;

        Art.find().where('category').equals(category).populate("artist reviews")
        .exec(function(err,searchResult){
            if(err) {throw err};
            if(searchResult === null){
                //console.log('not found category');
            }
            else{
                //console.log(searchResult);
                res.format({
                    "text/html":()=>{res.render("resultCategory",{results:searchResult,session:req.session})},
                })
                
            }
        })
    }
})


//get the medium of the artworks with the same medium and load partial pug page
app.get('/samemedium',(req,res)=>{
    if(req.session.loggedin == true){
        //console.log(req.query.medium);
        let medium = req.query.medium;

        Art.find().where('medium').equals(medium).populate("artist reviews")
        .exec(function(err,searchResult){
            if(err) {throw err};
            if(searchResult === null){
                //console.log('not found medium');
            }
            else{
                //console.log(searchResult);
                res.format({
                    "text/html":()=>{res.render("resultMedium",{results:searchResult,session:req.session})},
                })
            }
        })
    }
})


//render the page for searching
app.get('/search',(req,res)=>{
    res.render('search',{ session: req.session });
})


//query artwork based on artname, artistname and category 
app.put('/search',(req,res)=>{
    let searchArtName = req.query.searchArtName;
    let searchArtistName = req.query.searchArtistName;
    let searchCategory = req.query.searchCategory;

    if(searchCategory == ""){
        Art.find({}).where('name').equals(searchArtName).where('category').equals(searchCategory)
        .exec(function(err,searchResult){
        if(err) throw err;
        if(searchResult===null){
            console.log('not found');
            res.status(404).send("Unknown resource");
        }
        else{
            console.log(searchResult);
            res.format({
                "text/html":()=>{res.render("searchResult",{results:searchResult,session:req.session})},
            })
        }
        })
    
    }else{
        Art.find({}).where('category').equals(searchCategory)
        .exec(function(err,searchResult){
            if(err) throw err;
            if(searchResult===null){
                console.log('not found');
                res.status(404).send("Unknown resource");
            }
            else{
                console.log(searchResult);
                res.format({
                    "text/html":()=>{res.render("searchResult",{results:searchResult,session:req.session})},
                })
            }
        })
    }
})



//render page to addart
app.get('/addart',(req,res)=>{
    res.render('addArt',{session:req.session});
})


//add artwork
app.post('/addart',(req,res)=>{
    //console.log(req.body.year);
    if(req.session.loggedin == true){
        let newArt = new Art({
            name:req.body.artName,
            artist:req.session.userid,
            year:req.body.year,
            category:req.body.category,
            medium:req.body.medium,
            description:req.body.description,
            image:req.body.image
        })
        newArt.save(function(err,result){
            //duplicate key
            if ( err && err.code === 11000 ) {
                console.log("same")
                res.status(403).send();
            }
            else{
                console.log("here")
                let obj_id = new ObjectId(req.session.userid);
                User.findOne({_id:obj_id},function(err,result){
                    //console.log(result.art);
                    result.art.push(newArt);
                    result.save(function(err,result){
                        if (err) throw err;
                        //console.log(result);
                        res.status(200).send()
                    })
                });
                //console.log(result);
            } 
        })
    }
    else{
        res.status(405).send()
    }
    
})


//render page to addworkshop
app.get('/addworkshop',(req,res)=>{
    res.render('addWorkshop',{session:req.session});
})

//post workshop
app.post('/addworkshop',(req,res)=>{
    //console.log(req.body.newWorkshop);
    let newWorkshop = new Workshop({
        title:req.body.workshopTitle,
    })
    newWorkshop.save(function(err,result){
        if (err) throw err;
        let obj_id = new ObjectId(req.session.userid);
        User.findOne({_id:obj_id},function(err,result){
            //console.log(result.art);
            result.workshopOrganize.push(newWorkshop);
            result.save(function(err,result){
                if (err) throw err;
                //console.log(result);
                res.status(200).send()
            })
        });
        //console.log(result);
    })
})

//get workshop details
app.get('/workshop/:workshopId',(req,res)=>{
    let workshop_id = new ObjectId(req.params.workshopId);

    Workshop.findById(workshop_id).populate('attendee')
    .exec(function(err,searchResult){
        if (err) {throw err};
        if(searchResult === null){
            res.render('notFound');
        }
        else{
            //console.log("workshop")
            //console.log(searchResult);
            res.render('workshop', {workshop: searchResult, session:req.session});
        }
    })
})

//put request to register
app.put('/registerWorkshop',(req,res)=>{
    let workshop_id = new ObjectId(req.body.workshopId);
    //console.log(workshop_id);
    let user_id = new ObjectId(req.session.userid);
    Workshop.findOne({_id:workshop_id},function(err,result){
        if (err) throw err;
        //console.log(result);
        if(result.attendee.includes(user_id) === false){
            result.attendee.push(user_id);
            result.save(function(err,savedResult){
            //console.log(savedResult);
            })
            User.findOne({_id:user_id},function(err,searchResult){
                if (err) throw err;
                //console.log(searchResult);
                searchResult.workshopAttend.push(workshop_id);
                searchResult.save(function(err,result){
                //console.log(result);
                res.status(200).send()  
                })
            })
        }
    })
})


//put request to follow
app.put('/follow', (req,res)=>{
    let artist_id = new ObjectId(req.body.artistId);
    let obj_id = new ObjectId(req.session.userid);
    //console.log(artist_id);
    //console.log(obj_id);
    
    User.findOne({_id:obj_id},function(err,result){
        if (err) throw err;
        //console.log(result);
        if(result.following.includes(artist_id) === false){
            result.following.push(artist_id);
            result.save(function (err,result){
            if (err) throw err;
                console.log(result);    
            })
            User.findOne({_id:artist_id},function(err,result){
                //console.log(result);
                result.followers.push(obj_id);
                result.save(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    res.status(200).send()  
                })
            })
        }
    })
})



app.put('/unfollow',(req,res)=>{
    console.log(req.body.artistId);
    let artist_id = new ObjectId(req.body.artistId);
    let obj_id = new ObjectId(req.session.userid);
    //console.log(artist_id);
    //console.log(obj_id);
    User.findOne({_id:obj_id},function(err,result){
        if (err) throw err;
        //console.log(result);
        if(result.following.includes(artist_id) === true){
            result.following.pull(artist_id);
            result.save(function (err,result){
            if (err) throw err;
                console.log(result)    
            })
            User.findOne({_id:artist_id},function(err,result){
                //console.log(result);
                result.followers.pull(obj_id);
                result.save(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    res.status(200).send()  
                })
            })
        }
    })
})


app.put('/like',(req,res)=>{
    console.log(req.body.artId);
    let art_id = new ObjectId(req.body.artId);
    let obj_id = new ObjectId(req.session.userid);
    console.log(art_id);
    User.findOne({_id:obj_id},function(err,result){
        if (err) throw err;
        //console.log(result);
        if(result.like.includes(art_id) === false){
            result.like.push(art_id);
            result.save(function (err,result){
            if (err) throw err;
                console.log(result);
            })
            Art.findOne({_id:art_id},function(err,result){
                //console.log(result);
                result.like.push(obj_id);
                result.save(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    res.status(200).send()    
                })
            })
        }
    })
})

app.put('/unlike',(req,res)=>{
    console.log(req.body.artId);
    let art_id = new ObjectId(req.body.artId);
    let obj_id = new ObjectId(req.session.userid);
    console.log(art_id);
    User.findOne({_id:obj_id},function(err,result){
        if (err) throw err;
        //console.log(result);
        if(result.like.includes(art_id) === true){
            result.like.pull(art_id);
            result.save(function (err,result){
            if (err) throw err;
                console.log(result);
            })
            Art.findOne({_id:art_id},function(err,result){
                //console.log(result);
                result.like.pull(obj_id);
                result.save(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    res.status(200).send()    
                })
            })
        }
    })
})


app.post('/review',(req,res)=>{
    //console.log(req.body.artId);
    //console.log(req.body.review);
    let review = req.body.review;
    let art_id = new ObjectId(req.body.artId);
    let obj_id = new ObjectId(req.session.userid);
    //console.log(obj_id);
    let username;
    let artname;
    User.findById(obj_id).exec(function(err,searchResult){
        username = searchResult.username;
        //console.log(username);
        Art.findById(art_id).exec(function(err,searchResult){
            artname = searchResult.name;
            let newReview = new Review({
                user:obj_id,
                art:art_id,
                review:review,
                username:username
            })
            newReview.save(function(err,result){
                if(err) throw err;
                console.log("review")
                console.log(result);
                User.findOne({_id:obj_id},function(err,result){
                    result.reviews.push(art_id);
                    result.save(function(err,result){
                        console.log("user")
                        console.log(result);
                        if (err) throw err;
                        Art.findOne({_id:art_id},function(err,result){
                            console.log("art")
                            console.log(result);
                            result.reviews.push(newReview);
                            result.save(function(err,result){
                                if(err)throw err;
                                console.log(result);
                                res.status(200).send();
                            })
                        })
                    })
                })
            })
        })
    })
})



// Rendering the registration page.
//from t9-demo
app.get("/register", (req, res) => {

	res.render("register", { session: req.session });
     
});

// Saving the user registration to the database.
//from t9-demo

app.post("/register", async (req, res) => {
    console.log('register')
    let newUser = req.body;
    console.log(newUser);
    try{
        const searchResult = await User.findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await User.create(newUser);
            res.status(200).send();
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }  

});


// Search the database to match the username and password .
//from t9-demo
app.post("/login", async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

    try {
        const searchResult = await User.findOne({ username: username });
        console.log(searchResult);
        if(searchResult != null) { 
            if(searchResult.password === password) {
                // If we successfully match the username and password
                // then set the session properties.  We add these properties
                // to the session object.
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                if(searchResult.artist === true){
                    req.session.artist = true;
                }
                //console.log(req.session.userid);
                res.render('home', { session: req.session })
            } else {
                res.status(401).send("Not authorized. Invalid password.");
                
            }
        } else {
            res.status(401).send("Not authorized. Invalid password.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }    

});

// Log the user out of the application.
//from t9-demo
app.get("/logout", (req, res) => {

    // Set the session loggedin property to false.
	if(req.session.loggedin) {
		req.session.loggedin = false;
	}
	res.redirect(`http://localhost:3000/`);

});

mongoose.connect('mongodb://127.0.0.1/a5', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	app.listen(3000);
	console.log("Server listening on http://localhost:3000");
});