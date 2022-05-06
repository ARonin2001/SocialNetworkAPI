roleUser = db.roles.findOne({"role": "user"})

db.users.insertOne({
	"email": "Jovani30@gmail.com", // (неповторяющееся поле)
	"password": "5",
	"img": {
		"ava": null,
		"backImg": null
	},
	"roles": [{"$ref": "roles", "$id": roleUser._id}],
	"languages": {
		"native": [],
		"fluent": [],
		"learning": []
	},
	"friends": [],
	"posts": [], // (неповторяющееся поле)
	"aboutMe": {
		"name": "Mikaelo",
		"lastName": "Giorgo",
		"dateBirth": new Date('2021-11-25'),
		"gender": "male",
		"location": {
			"country": {},
			"city": {}
		},
		"status": "I can do it!",
		"description": "It's just description",
		"hobby": ["Japanese", "WEB Front-end", "Workout", "etc"]
	}
})

// get user by id 
db.users.find({
	"roles.$id": ObjectId("6275140558caf12344ca36ed")
})

// get one user by id from documentation role
roleUser = db.roles.findOne({"role": "user"})

db.users.find({"roles.$id": roleUser._id})