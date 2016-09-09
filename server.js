var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
app.set('port',port);

app.use('/', express.static('./'));
app.get('/',function(req,res){
  res.sendFile('./index');
});

app.use('/raindrops', express.static('./RainDrops'));
app.get("/raindrops",function(req,res){
  res.sendFile('./index');
});

app.listen(port,function(){
  console.log("Js Games server now listening on port:",port);
});
