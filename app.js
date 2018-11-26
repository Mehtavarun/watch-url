const app = require('express')(),
	  request = require('request'),
	  bodyParser = require('body-parser'),
	  urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.json());

require('./routes/route.js')(app, request, urlencodedParser);

const port = process.env.PORT || 6500;

app.listen(port , ()=>{
	console.log(`server  running on ${port}`)
});