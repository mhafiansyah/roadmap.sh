import { prisma } from "../../lib/prisma.js";

export const getAllBlog = async() => {
    const data = await prisma.blog.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    });

    return data;
}

export const addBlog = async(title: string, content: string, user_id: string) => {
    const addBlog = await prisma.blog.create({
        data: {
            title: title,
            content: content,
            user: {
                connect: {
                    id: user_id
                }
            }
        }
    })

    return addBlog;
}

export const editBlog = async(id: number, title: string, content: string, user_id: string) => {
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

export const deleteBlog = async(id: number, user_id: string) => {
    const deleteBlog = await prisma.blog.delete({
        where: {
            id: id
        }
    })

    return deleteBlog;
}