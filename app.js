var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

//app config
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
    res.redirect("/blogs")
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
            console.log(err);
       } else {
            res.render("index", {blogs: blogs});     
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running"); 
});
