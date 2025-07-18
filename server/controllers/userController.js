const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {createUser,getUserByUserName, getUserByEmail} =require('../models/userModel');



const signupUser=async (req,res)=>{
    const {username,email,password}=req.body;
    if(!email ||!username ||!password)
        return res.status(400).json({message:"username and password are required"});
    try{
        const existingUser=await getUserByUserName(username);
        if(existingUser)
            return res.status(400).json({error:'User already exists'});

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await createUser({username,email,password:hashedPassword});

        const token=jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({newUser,token});

    }
    catch(err){
        res.status(500).json({error: err.message || 'Internal server error'});
    }
};


const loginUser=async(req,res)=>{
    const {username,password}=req.body;
    try{
        const user=await getUserByUserName(username);
        if(!user) return res.status(404).json({error:"Account doesn't exist, signup to continue"});


        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(401).json({error:'invalid credentials'});
        }

        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({user,token});
    }
    catch(err){
        res.status(500).json({error:'login failed'});
    }
};

module.exports={
    loginUser,
    signupUser,
};

