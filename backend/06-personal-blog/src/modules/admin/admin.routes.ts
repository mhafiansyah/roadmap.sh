import { Router } from "express";
import type { Request, Response } from "express";
import * as admin from './admin.controller.js';

const router = Router();

router.get('/', async (req, res) => {
    const blogs = await admin.getAllBlog();
    res.send(blogs);
})

router.post('/new/article', async (req: any, res) => {
    const { title, content } = req.body;
    const user_id = req.session.user.id;
    const newBlog = await admin.addBlog(title, content, user_id);

    res.send(newBlog);
})

router.post('/edit/article/:id', async (req: any, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.session.user.id;
    
    const editBlog = await admin.editBlog(Number(id), title, content, user_id);
    
    res.send(editBlog);
})

router.delete('/delete/article/:id', async(req: any, res) => {
    const { id } = req.params;
    const user_id = req.session.user.id;

    const deleteBlog = await admin.deleteBlog(Number(id), user_id);

    res.send(deleteBlog);
})

export default router;