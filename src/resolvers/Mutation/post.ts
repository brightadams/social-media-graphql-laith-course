import { Context } from "../../index"
import {Post} from ".prisma/client"
import { Prisma } from '@prisma/client';
import {canUserMutatePost} from "../../utils/canUserMutatePost"
interface PostArgs {
    post: {
        title?: string
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    //the Post here is from the prisma schema, so we want the post object to take the form of the schema..
    post: Post | Prisma.Prisma__PostClient<Post, never> | null
}


export const postResolvers = {
    postCreate: async(parent: any, {post}: PostArgs, {prisma,userInfo}: Context): Promise<PostPayloadType>=>{

        if(!userInfo){
            return {
                userErrors:[{
                    message:"You are not logged in"
                }],
                post: null
            }
        }
        const {title, content} = post
        if(!title || !content){
            return {
                userErrors:[{
                    message:"You must provide title and content"
                }],
                post: null
            }
        }

        

        return {
            userErrors:[],
            post:  prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId
                }
            })
        }

    },
    postUpdate: async(_:any, {post,postId}: {postId:string,post: PostArgs["post"]}, {prisma,userInfo}: Context): Promise<PostPayloadType> =>{
        if(!userInfo){
            return {
                userErrors:[{
                    message:"You are not logged in"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        })

        if(error) return error;

        const {title, content} = post;

        if(!title && !content){
            return {
                userErrors: [
                    {
                        message:"Provide title or  content data"
                    }
                ],
                post: null
            }
        }
        const existingPost = await prisma.post.findUnique({
            where:{
                //we do this because the ID prisma schema is a number but the graphql schema is a string
                id: Number(postId)
            }
        })

        if(!existingPost){
            return {
                userErrors: [
                    {
                        message:"Post doesnt exist"
                    }
                ],
                post: null
            }
        }

        let payloadToUpdate = {
            title,
            content,
        }

        if(!title) delete payloadToUpdate.title
        if(!content) delete payloadToUpdate.content
        
        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate
                },
                where:{
                    id: Number(postId)
                }
            })
        }

    },
    postDelete: async(_: any, {postId}: {postId: string}, {prisma, userInfo}:Context): Promise<PostPayloadType>=>{
        if(!userInfo){
            return {
                userErrors:[{
                    message:"You are not logged in"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        })

        if(error) return error;

        const post = await prisma.post.findUnique({
            where:{
                //we do this because the ID prisma schema is a number but the graphql schema is a string
                id: Number(postId)
            }
        })

        if(!post){
            return {
                userErrors: [
                    {
                        message:"Post doesnt exist"
                    }
                ],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post
        }

    },
    postPublish: async(_:any, {postId}: {postId: string}, {prisma, userInfo}: Context): Promise<PostPayloadType>=>{
        if(!userInfo){
            return {
                userErrors:[{
                    message:"You are not logged in"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        })

        if(error) return error;

        return {
            userErrors:[],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: true
                }
            })
        }
    },
    postUnpublish: async(_:any, {postId}: {postId: string}, {prisma, userInfo}: Context): Promise<PostPayloadType>=>{
        if(!userInfo){
            return {
                userErrors:[{
                    message:"You are not logged in"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        })

        if(error) return error;

        return {
            userErrors:[],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: false
                }
            })
        }
    }
}