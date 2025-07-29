const {PrismaClient}=require('@prisma/client');

const prisma=new PrismaClient();

const getTodayPrompt=async(req,res)=>{
    try{
        const today=new Date();
         today.setDate(today.getDate() );
        today.setHours(0,0,0,0);

        const prompt=await prisma.prompt.findUnique({
            where:{
                promptDate:today,
            },
        });

        if(!prompt){
            return res.status(404).json({message:'No prompt for today'});
        }

        res.json(prompt);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
};

module.exports={getTodayPrompt};