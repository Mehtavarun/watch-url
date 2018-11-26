# watch-url
## Steps to the run App
1. Run the Mongoose Client for MongoDB
2. TO install dependencies
```
npm install
```
3. To run the APP
```
node app
```
## Examples to run APP
1. To insert new URL, make a POST request to localhost:<port_number>/ 
    EX data => body:{
              url: 'http://news.com/api/example',
              method: 'get'
            }
```
http://localhost:6500/

```
2. To get data for particular URL, make a "GET" request and add it's id as parameter else to get all make a "GET" request without any parameter. 
```
http://localhost:6500/:id
```
3. To delete the URL to be monitored make a "DELETE" request to following URL with ID of that URL
```
http://localhost:6500/:id
```
4.To edit the URL being processed make a "PUT" request and add data in body with it's ID passed as parameter
EX data => body:{
              method: 'post'
            }
```
http://localhost:6500/:id

```
