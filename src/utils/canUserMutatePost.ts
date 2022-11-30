import { Context } from '..';
interface CanUserMutatePostParams {
    userId: number
    postId: number
    prisma: Context["prisma"]
}

//makes sure only the user who made a post can update, delete and publish..
export const canUserMutatePost = async({
    userId,
    postId,
    prisma
}:CanUserMutatePostParams) =>{
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user){
        return {
            userErrors:[{
                message: "User not found"
            }],
            post: null
        }
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if(post?.authorId !== user.id){
        return {
            userErrors:[{
                message: "Post not owned by user"
            }],
            post: null
        }
    }
}