require("dotenv").config();

const express=require("express");
const cors=require("cors");

const userRoutes=require('./routes/userRoutes');

const {PrismaClient}= require("@prisma/client");




const app=express();
const prisma=new PrismaClient();

app.use(cors());
app.use(express.json());


app.use('/api/users',userRoutes);


app.get('/',(req,res)=>{
    res.send("journiva backend")
});

app.get("/users",async(req,res)=>{
    try{
        const users=await prisma.user.findMany();
        res.json(users);
    }
    catch(err){
        SVGComponentTransferFunctionElement.error("error: ",err);
        res.status(500).json({error:'Internal Server error'});
    }
});

app.post('/users',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await prisma.user.create({
            data:{
                email,
                password,
                isGoogleUser:false,
            },
        });
        res.status(201).json(user);

    }
    catch(err){
        res.status(400).json({error:'user creation failed',details:err});
    }
});

app.post('/journal',async (req,res)=>{
    const {userId,content,mood,tags,isPrivate}=req.body;

    try{
        const journal=await prisma.journal.create({
            data:{
                content,
                mood,
                tags,
                isPrivate,
                user:{connect:{id:userId}},
            },
        });
        res.status(201).json(journal);
    }
    catch(err){
        res.status(400).json({error:"Failed to create journal",details:err});
    }
});

app.get('/journals/:userId',async(req,res)=>{
    try{
        const journals=await prisma.journal.findMany({
            where:{userId:req.params.userId},
            orderBy:{createdAt:'desc'},
        });
        res.json(journals);
    }
    catch(err){
       
        res.status(500).json({error:"Failed to fetch journals",details:err});
    }
});

app.post("/events",async(req,res)=>{
    const {userId,title,tag,eventDate}=req.body;
    try{
        const event=await prisma.event.create({
            data:{
                title,
                tag,
                eventDate:new Date(eventDate),
                user:{connect:{id:userId}},

            },
        });
        res.status(201).json(event);
    
    }
    catch(err){
        res.status(400).json({error:"Error in event creation",details:err});
    }
        
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Journiva API running at http://localhost:${PORT}`);
});