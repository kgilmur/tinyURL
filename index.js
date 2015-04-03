var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./models');
var hashids = require('hashids');
hashids = new hashids("This is Katie's salt")



app.set("view engine", "ejs");



app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}))


app.get('/', function(req,res){
 res.render('index');
});

app.get('/show/', function(req,res){
 res.render('show');
});


// app.post('/show', function(req,res){
//  res.render('show');
// })


app.post('/show', function(req, res) {

  db.link.create({url:req.body.url}).then(function(data) {
    var shortened = hashids.encode(data.id);
    data.hash = shortened;
    data.save().then(function() {
        res.render('show', {hash: data.hash});
        // res.redirect('/show/'+data.id);
    })
  })
})

app.get('/:hash', function(req, res) {
  var id = parseInt(hashids.decode(req.params.hash))
  db.link.find(id).then(function(link) {
    res.redirect('show', link.url)
    // res.render('show', {url: req.headers.host + "/" + .hash});
  })
})

// db.link.findOrCreate({where:{url:req.body.url}}).spread(function(link, created) {
//   var shortened = hashids.encode(link.id)
//   link.hash = shortened;
//     link.save().then(function(data)  {
//      // res.render('show',{url: data.url,hash: data.hash});
//      // console.log(data);

//      res.render('show', {url: req.headers.host + "/" + data.hash});
//     })
//   })
// });



// app.get("/:hash", function(req,res){
//  db.urls.find({where:{hash:req.params.hash}}).then(function(decoded){
//    if(decoded){
//      res.redirect(decoded.url);
//    }else{
//      res.send('unknown url');
//    }

//  })
// })



app.listen(process.env.PORT || 3000, function(){
 console.log('listening on 3000')
});






