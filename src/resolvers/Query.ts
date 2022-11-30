import { Context } from ".."

export const Query =  {
    hello: ()=>"World",
    posts: async(_:any, __:any, {prisma}: Context)=>{
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    createdAt:"desc"
                }
            ]
        })
        console.log(posts)
        return posts
    },
    me: (_:any, __:any, {userInfo, prisma}: Context)=>{
        if(!userInfo) return null;
        return prisma.user.findUnique({
            where:{
                id: userInfo.userId
            }
        })
    },
    profile: async (_:any, {userId}: {userId: string}, {prisma,userInfo}: Context)=>{
        const isMyProfile = Number(userId) === userInfo?.userId

        const profile = prisma.profile.findUnique({
            where: {
                userId: Number(userId),
            }
        })

        if(!profile) return null;

        return {
            ...profile,
            isMyProfile
        }
    }
}