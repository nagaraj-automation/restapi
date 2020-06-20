//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true,useUnifiedTopology:true});
port=process.env.PORT || 3000;

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/posts", function(req, res){

  Post.find({}, function(err, posts){
      if(!err){
        res.send(posts);
      }else{
        res.send(err);
      }
    
  });
});


// app.get("/about",function(req,res){
//   res.render("about",{
//     aboutusContent:aboutContent
//   });
// });
// app.get("/contact",function(req,res){
//     res.render("contact",{
//       Contact:contactContent
//     });
// });

// app.get("/compose",function(req,res){
//   res.render("compose");
// });
app.post("/posts",function(req,res){
  const objPost=new Post({
    title: req.body.title,
    content: req.body.content
  });
  objPost.save(function(err){
    if (!err){
        res.send("Successfully posted your data");
    }else{
      res.send(err);
    }
  });
});


app.delete("/posts",function(req,res){
  
  Post.deleteMany(function(err){
    if(!err){
    res.send(`successfuly deleted items`);
    }else{
    res.send(err);
  }
})
});
////specific post and CURD oparation///
app.route("/posts/:postTitle")

.get(function(req, res){

  Post.findOne({title: req.params.postTitle}, function(err, foundPost){
    if (foundPost) {
      res.send(foundPost);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Post.update(
    {title: req.params.postTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Post.update(
    {title: req.params.postTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Post.deleteOne(
    {title: req.params.postTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(port, function() {
  console.log("Server started on port 3000");
});
