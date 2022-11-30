import { Context } from ".."
import { userLoader } from './../loaders/userLoader';

interface PostParentType {
    authorId: number;
}

export const Post =  {
    user: (parent:PostParentType, __:any, { prisma}: Context)=>{
        // console.log("hereee")
        // return prisma.user.findUnique({
        //     where:{
        //         id: parent.authorId
        //     }
        // })

        //so we use the batching method to increase the speed of our queries

        return userLoader.load(parent.authorId)
    },
}