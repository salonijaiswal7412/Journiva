const {PrismaClient}=require('@prisma/client');
const prisma =new PrismaClient();


const createUser=async ({username,email,password})=>{
    return await prisma.user.create({
         data: {
      username,
      email,
      password,
    },
    });
};

const getUserByEmail=async(email)=>{
    return await prisma.user.findUnique({where:{email}});
};

const getUserByUserName=async(username)=>{
    return await prisma.user.findUnique({where:{username}});
}

module.exports={
    createUser,
    getUserByEmail,
    getUserByUserName,
};