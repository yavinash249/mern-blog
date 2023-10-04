
const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET;


/**
 * 
 * Check Login
 */
const authMiddleware = (req, res, next) =>{
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({message: 'Unauthorized'}); 
  }
  try{
    const decoded = jwt.verify(token, jwtSecret)
    req.userId = decoded.userId;
    next();
  }catch(error){
   res.status(401).json({message: 'Unauthorized'}); 
  }
}



/**
 * get/
 * Admin - Login Page/
 */

router.get('/admin', async (req, res) => {
  

  try {
    const locals = {
        title: " Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }


    
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

});

/**
 * post/
 * Admin -check Login Page/
 */
router.post('/admin', async (req, res) => {
  
  try {
      const {username, password} = req.body;
      
      const user = await User.findOne({ username});
      if(!user ){
        return res.send(401).json({message: 'Invalid credentials'});
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if(!isPasswordValid){
        return res.send(401).json({message: 'Invalid credentials'});
      }
      
      const token = jwt.sign({userId: user._id}, jwtSecret)
      res.cookie('token', token, {httpOnly: true})
      res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }

}); 


/**
 * GET/
 *  Admin Dashboard-check Login Page/
 */
router.get('/dashboard', authMiddleware, async(req, res) => {

  try{
    const locals = {
      title : 'Dashboard',
      description: 'Simple Blog created with NodeJS ,express &mongodb'
    };
    const data = await Post.find(); 
    res.render('admin/dashboard',{
      locals,
      data,
      layout: adminLayout
    })
  
  }catch(error){
      console.log(error);
  }
});


/**
 * GET/
 *  Admin - Create new post/
 */
router.get('/add-post', authMiddleware, async(req, res) => {

  try{
    const locals = {
      title : 'Add Post',
      description: 'Simple Blog created with NodeJS ,express &mongodb'
    };
    const data = await Post.find(); 
    res.render('admin/add-post',{
      locals,
      layout: adminLayout
    })
  
  }catch(error){
      console.log(error);

/**
 * Post/
 *  Create new Post
 */  } 
});



/**
 * get/ put
 *  Admin - Edit  post/
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

/**
 * Edit/ put
 *  Admin - Edit  post/
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/edit-post/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});




router.post('/add-post', authMiddleware, async(req, res) => {

  try{
    console.log(req.body);
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });
      await Post.create(newPost);
      res.redirect('/dashboard');

    } catch (error) {
     console.log(error); 
    }
  }catch(error){
      console.log(error);
  }
});





// router.post('/admin', async (req, res) => {
  
//   try {
//       const {username, password} = req.body;
      
//       if(req.body.username === 'admin' && req.body.password === 'password'){
//         res.send('you are already logged in')
//       }else{
//         res.send('wrong username or password')
//       }
//       res.redirect('/admin')
    
//     res.render('admin/index', { locals, layout: adminLayout });
//   } catch (error) {
//     console.log(error);
//   }

// });



/** 
 * post 
 * Admin Registration 
*/




router.post('/register', async (req, res) => {
  
  try {
      const {username, password} = req.body;
      const hashedPassword = await bcrypt.hash(password,10);
      try{
        const user = await User.create({ username, password:hashedPassword });
        res.status(201).json({message: 'user created',user});
      }catch(error){
        if(error.code=== 11000){
          res.status(409).json({ message: 'user already exists'});
        }
        res.status(500).json({message: 'Internal Server Error'})
      }
      
  } catch (error) {
    console.log(error);
  }

});


/**
 * delete
 * admin delte post 
 */
router.delete('/delete-post/:id', authMiddleware, async(req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});



////admin logout

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  // res.json({ message: 'logout Sucessful. ' });
  res.redirect('/')
});



module.exports = router;