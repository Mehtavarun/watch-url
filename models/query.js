const mongoose = require('mongoose');
var Schema = require('./schema.js');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/watchurl')

module.exports = {
	insert: (body) =>{
		console.log(body)
		return mongoose.model('watchurl', dataSchema)
		.create(body)
		.then((data) =>{
			return {
				success: true,
				_id: data._id
			};
		})
		.catch((err)=>{
			console.log(err)
			return {
				success: false
			};
		});
	},

	insertTime :(id, time) =>{
		return mongoose.model('watchurl', dataSchema)
		   .findByIdAndUpdate({_id: id}, {$push: {"resTime": time}})
		   .then((data)=>{
				return {
					success: true
				};
			})
			.catch((err)=>{
				return {
					success: err
				};
			});
	},

	edit :(id, body) =>{
		return mongoose.model('watchurl', dataSchema)
		   .findOneAndUpdate({_id: id}, {$set: body})
		   .then((data)=>{
		   	console.log(data);
				return {
					success: true,
					_id: data._id
				};
			})
			.catch((err)=>{
				return {
					success: false
				};
			});
	},

	deleteUrl : (id) =>{
		return mongoose.model('watchurl', dataSchema)
		   .findByIdAndRemove({_id: id})
		   .then((data)=>{
				return {
					success: true,
					url: data.url,
					timeid: data.timeid
				};
			})
			.catch((err)=>{
				return {
					success: false
				};
			});
	},
		
	getAll : ()=>{ 
		return mongoose.model('watchurl', dataSchema)
			 .find()
			 .then((data)=>{
			    return {data};
			 })
			 .catch((err)=>{
			 	return {
					success: false
				};
			 });
	},

	getUrl : (id)=>{
		return mongoose.model('watchurl', dataSchema)
			.find({_id: id})
			.then((data)=>{
				return {data}
			})
			.catch((err)=>{
				return {
					success: false
				};
			})
	}
};