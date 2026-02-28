import { prisma } from "../../lib/prisma.js";

export const getAllBlog = async() => {
    const data = await prisma.blog.findMany();

    return data;
}

export const getBlogDetail = async(id: number) => {
    const blog = await prisma.blog.findFirst({
        where: {
            id: id,
        }
    })

    return blog;
}