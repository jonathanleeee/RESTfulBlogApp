var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

//app config

mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // this goes after bodyParser
app.use(methodOverride("_method"));

// Mongoose model config

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful routes

app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX route

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
            console.log(err);
       } else {
            res.render("index", {blogs: blogs});     
       }
    });
});

//NEW route

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

//CREATE route

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW route

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.render("show", {blog: foundBlog});
      }
   });
});


//EDIT route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.render("edit", {blog: foundBlog});
      }
   });
});

//UPDATE route

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
  });
});

//DELETE route

app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
   //redirect somewhere
});

//Listening route

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running"); 
});
