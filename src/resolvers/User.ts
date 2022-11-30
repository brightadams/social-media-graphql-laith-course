import { Context } from ".."

interface UserParentType {
    id: number;
}

export const User =  {
    posts: (parent:UserParentType, __:any, {userInfo, prisma}: Context)=>{
        //we want to show both puvlished and unpublished posts when its your own profile and only published post when it's someone else's profile

        const isOwnProfile = parent.id === userInfo?.userId;
        if(isOwnProfile){
            return prisma.post.findMany({
                where:{
                    authorId: parent.id
                },
                orderBy: [
                    {
                        createdAt:"desc"
                    }
                ]
            })
        }else{
            return prisma.post.findMany({
                where:{
                    authorId: parent.id,
                    published: true,
                },
                orderBy: [
                    {
                        createdAt:"desc"
                    }
                ]
            })
        }
        
    },
}