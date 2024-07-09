//require models
const fs = require('fs');
const mongoose = require('mongoose')

//require model
const Art = require("./model/ArtModel.js");
const User = require("./model/UserModel.js")

//gallery readFile
let gallery = JSON.parse(fs.readFileSync('./data/gallery.json').toString());
//open connection to mongoose
mongoose.connect('mongodb://127.0.0.1/a5', {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	await db.dropDatabase();

	//for each artworks in gallery,
	//save the artist as a new User,
	//give the users a password
	//initialize every artwork 
	//relate user's art to art
	//relate arts to users
	gallery.forEach(obj=>{
		let username = obj.artist;

		let artist = new User({
			username:username,
			password:"password",
			artist:true

		})

		artist.save(function(err){
			if(err)throw err;
			let art = new Art({
				name:obj.name,
				artist:artist._id,
				year:obj.year,
				category:obj.category,
				medium:obj.medium,
				description:obj.description,
				image:obj.image
			})
			art.save(function(err,result){
				if(err) throw err;
				artist.art.push(art);
				artist.save(function(err,result){
					if(err) throw err;
					console.log(result);
					console.log("Loaded Database");
				})
			})
		})

	})
	
});