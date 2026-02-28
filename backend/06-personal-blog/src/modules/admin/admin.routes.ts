import { Router } from "express";
import type { Request, Response } from "express";
import * as admin from './admin.controller.js';

const router = Router();

router.get('/', async (req, res) => {
    const blogs = await admin.getAllBlog();
    res.send(blogs);
})

router.get('/new/article', async (req, res) => {
    const { title, content } = req.body;
    const newBlog = await admin.addBlog(title, content);

    res.send(newBlog);
})

router.get('/edit/article/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const editBlog = await admin.editBlog(Number(id), title, content);
    
    res.send(editBlog);
})

export default router;