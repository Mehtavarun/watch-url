module.exports = (app, request, urlencodedParser) => {

	var query = require('../models/query.js');
	var urls = [];   // array to store timerID
	var count = -1;
	var val;		// maintaining pointer for current timerid
	var timerid = null;

	// Inserting new URL in database
	app.post('/', urlencodedParser,(req, res)=>{
		count++;
		var val = count;
		var data = req.body;
		var id = '';

		data["timeid"] = val;
		var result = query.insert(data);
		result.then(data => {
			res.json(data)
			id = data._id;
		});

		// Processing URL to send request and get response every second
		timerid = setTimeout(function monitor(){
			var method = req.body.method.toUpperCase();
			var start = new Date();
			//making request to the specified URL
			request({
				url: req.body.url,
				method: method,
				time: true
			}, (err, response)=>{
				//calculate and insert time in DB every second
				var resTime = new Date() - start;
				var insertTime = query.insertTime(id, resTime);
			});
			timerid = setTimeout(monitor, 1000);
			urls[val] = timerid;
		}, 1000);	
	});

	// getting all URL's along with their reponse Time
	app.get('/',(req, res)=>{
		var result = query.getAll();
		result.then(data => res.json(data));
	});

	//Getting particular URL details from DB 
	//showing data as required percentiles 
	app.get('/:id',(req, res)=>{

		var result = query.getUrl(req.params.id);
		result.then(data => {
			var newData = {
				url: data.data[0].url,
				data: data.data[0].data,
				method: data.data[0].method
			};
			newData.resTime = data.data[0].resTime.slice(0, 100);
			//sorting the list of response times for getting percentiles
			newData.resTime.sort((a, b)=>{return a - b});

			var len = newData.resTime.length;
			newData["50th_percentile"] = newData.resTime[len/2 - 1];
			newData["75th_percentile"] = newData.resTime[len * 3/4 - 1];
			newData["95th_percentile"] = newData.resTime[len * 19/20 - 1];
			newData["99th_percentile"] = newData.resTime[len * 99/100 - 1];

			res.json(newData);
		}).catch(err=>console.log(err));
	});

	//deleting the particular URL and stopping it's timeout
	app.delete('/:id',(req, res)=>{
		var result = query.deleteUrl(req.params.id);
		result.then((data) => {
			if(data.success){
				res.json({success: true});
				clearTimeout(urls[data.timeid]);
			}
			else 
				res.json({success: false});
		});
	});

	//Editing the URL as per the data provided in Body
	// and running it again
	app.put('/:id',(req, res)=>{
		// retrieving data from db to be updated 
		var result = query.getUrl(req.params.id);
		result
		.then((data) => {
			//checking what params have been provided
			var newData = {
				url: (req.body.url) ? req.body.url : data.data[0].url,
				data: (req.body.data) ? req.body.data : data.data[0].data,
				method: (req.body.method) ? req.body.method : data.data[0].method,
				resTime: data.data[0].resTime,
				timeid: data.data[0].timeid
			};			
			//stopping the previous background process for that URL
			clearTimeout(urls[data.data[0].timeid]);
			//editing the data as per the request made
			var newRes = query.edit(req.params.id, newData);
			newRes.then((newUrl)=>{
				res.json(newUrl);
			});
			return newData;
		})
		.then((data)=>{
			//Starting new process for making request 
			//with edited data provided
			timerid = setTimeout(function monitor(){
				var method = data.method.toUpperCase();
				var start = new Date();
				request({
					url: data.url,
					method: method,
					time: true
				}, (err, response)=>{
					
					var resTime = new Date() - start;
					var insertTime = query.insertTime(req.params.id, resTime);
					insertTime.then((data)=>console.log(data))	
				})
				timerid = setTimeout(monitor, 1000);
				urls[data.timeid] = timerid;
			}, 1000);
		})
		.catch((err) => console.log(err));
	});
}