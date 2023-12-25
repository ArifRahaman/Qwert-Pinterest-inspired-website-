
/* GET home page. */
// router.get('/allusers', async function(req, res, next) {
//   let user1=await  userModel1.findOne({_id:"6585bd01675a06d64871591f"})
//   // Fetch9ing real data  as you required real
//     .populate('posts');
//     res.send(user1);
// });



// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });
// router.get("/createuser1", async function (req, res, next) {
//  let userdata=await userModel1 
//   .create({
//   username: "Danish",
//   password : "qwe12332445",
//   posts:[],
//   email:"Abdul1234@gmail.com" ,
//   fullname:"John doe"
//   })
//   res.send(userdata);
// });

// router.get("/createpost", async function (req, res, next) {
// let post = await postModel1.create({
//  posttext: "Hello  this is third",
//  user:"6585bd01675a06d64871591f"
// });
// let user=await userModel1.findOne({_id:"6585bd01675a06d64871591f"});

// user.posts.push(post._id);
// user.save();
//   res.send("Doneeee");
// });






var express = require("express");
var router = express.Router();
const userModel1 = require("./users");
const postModel1 = require("./post");
const passport=require('passport')
const upload=require("./multer")
const localStrategy=require("passport-local")
passport.use(new localStrategy(userModel1.authenticate()));

router.get("/profile",isLoggedIn, async function (req, res, next) {
      const user=await userModel1.findOne({
        username:req.session.passport.user
      })
      .populate("posts");
      res.render("profile",{user});
});

router.get("/login", function (req, res, next) {
   
    res.render("login", { error: req.flash("error") });
});


router.get("/forgot1", function (req, res, next) {

  res.render("forgot1");
});



router.get("/feed", function (req, res, next) {
  res.render("feed");
});

// router.post(
//   "/fileupload",
//   isLoggedIn,
//   upload.single("image"),
//   async function (req, res, next) {
//     // Process the uploaded file
//     // res.send("Uploaded");
//    const user= userModel1.findOne({username:req.session.passport.user});
//   user.dp=req.file.filename;
//   await user.save();
//   res.redirect("/profile")
//   }
// );

router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("image"),
  async function (req, res, next) {
    try {
      const user = await userModel1.findOne({
        username: req.session.passport.user,
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Check if user.dp exists before assigning a value
      if (user.dp) {
        // Handle the case where there's an existing profile picture (optional)
        // You might want to delete the existing file or handle it differently
      }

      user.dp = req.file.filename;
      await user.save();

      res.redirect("/profile");
    } catch (error) {
      console.error("Error during file upload and user update:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// router.post("/upload", isLoggedIn,upload.single("file"), async function (req, res, next) {
// // Log the uploaded file information for debugging

//   if (!req.file) {
//     return res.status(404).send("No files were given");
//   }
//   const user= await userModel1.findOne({username:req.session.passport.user});
//   const post=await postModel1.create({
//     image: req.file.filename,
//     imageText: req.body.filecaption,
//     user:user._id
//   });
//   user.posts.push(post._id);
//    await user.save();
//   // res.send("Done");
//   // res.send("File uploaded successfully");
// });


router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    try {
      if (!req.file) {
        return res.status(404).send("No files were given");
      }

      const user = await userModel1.findOne({
        username: req.session.passport.user,
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const post = await postModel1.create({
        image: req.file.filename,
        imageText: req.body.filecaption,
        user: user._id,
      });

      user.posts.push(post._id);
      await user.save();

      // res.send("File uploaded and post created successfully");
      res.redirect("/profile");
    } catch (error) {
      console.error("Error during file upload and post creation:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/register",  function(req, res){
  
    const { username, email, fullname } = req.body;
    const newUser = new userModel1({ username, email, fullname });

  userModel1.register(newUser, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash:true,
  }),
  function (req, res) {
    // This function might be unnecessary, you can remove it if not needed
  }
);


 router.get("/logout", function(req,res){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/')
  });
 })

 function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) return next();
   res.redirect("/login");
 }




module.exports = router;
