export = {};
const router = require("express").Router();
const userModel = require("../users/users-model");
const bcryptjs = require("bcryptjs"); //bcript do the salting
const checkPayloadShape=(req:any,res:any,next:any)=>{
    if(!req.body.username || !req.body.password){
        res.status(401).json({message:"username and password required"});
    }
    else{
        next();
    }
};
const userMustNotExist=async(req:any,res:any,next:any)=>{
    const users = await userModel.findBy({username:req.body.username});
    if(users.length !== 0){
        res.status(400).json({message:"user already exists"});
    }
    else{
        next();
    }
};
const userMustExist=async(req:any,res:any,next:any)=>{
    const users = await userModel.findBy({username:req.body.username});
    if(users.length === 0){
        res.status(404).json({message:"user not found"});
    }
    else{
        req.user = users[0];
        next();
    }
};
router.post("/register",checkPayloadShape,userMustNotExist,async(req:any,res:any,next:any)=>{
    try{
        req.body.password = bcryptjs.hashSync(req.body.password, 14); //run 2^14 times
        const {username,password} = req.body;
        const user = await userModel.add({username,password});
        res.status(201).json(user);
    }
    catch(err){
        next(err);
    }

});

router.post("/login",checkPayloadShape,userMustExist,(req:any,res:any,next:any)=>{
    try{
        if(bcryptjs.compareSync(req.body.password, req.user.password)){
            req.session.user = req.user;
            res.status(200).json({message:"login successful"});
        }
        else{
            res.status(403).json({message: "invalid credentials"});
        }
    }
    catch(err){
        next(err);
    }
});
router.get("/logout",(req:any,res:any,next:any)=>{
    if(req.session){
        req.session.destroy((err:any)=>{
            if(err){
                res.json("cant log out");
            }
            else{
                res.json("you are logged out");
            }
        })
    }
    else{
        res.json("no session found");
    }
});


module.exports = router;