import { prisma } from "../../lib/prisma.js";

export const getAllBlog = async() => {
    const data = await prisma.blog.findMany();

    return data;
}

export const editBlog = async(id: number, title: string, content: string) => {
    const editBlog = await prisma.blog.update({
        where: {
            id: id,
        },
        data : {
            title: title,
            content: content
        }
    })

    return editBlog;
}

export const addBlog = async(title: string, content: string) => {
    const userId = 2;
    const addBlog = await prisma.blog.create({
        data: {
            title: title,
            content: content,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })

    return addBlog;
}