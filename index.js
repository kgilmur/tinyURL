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

  db.link.create({url:req.body.q}).then(function(data) {
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
    res.redirect(link.url)
  })
})

// app.post('/show',function(req,res){
//  // articleList.push({title:req.body.title,body:req.body.body});
//  // articleList.push(req.body);

//  db.link.findOrCreate({where: { url: req.body.q,}})
//  .spread(function(link, created) {
//    console.log(link) // returns info about the user
//    var hash = hashids.encode(link.id)
//    //for and if else^^^^
//    res.render('show',{hash:hash});
//    link.hash = hash
//    link.save()
//  })

// });

// app.get("/:hash",function(req,res){
//  var id = parseInt(hashids.decode(req.params.hash))
//  db.link.find(id).then(function(link)
//    {res.redirect('http://'+link.url)})
// })


// app.get('/:hash', function(req, res) {
//   var id = parseInt(hashids.decode(req.params.hash))
//   db.link.find({hash:req.params.hash})
//   res.redirect('show'+data.hash)



app.listen(process.env.PORT || 3000, function(){
 console.log('listening on 3000')
});






