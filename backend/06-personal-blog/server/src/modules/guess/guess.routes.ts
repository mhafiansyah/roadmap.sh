import { Router } from "express";
import * as guess from './guess.controller.js';

const router = Router();

router.get('/home', async (req, res) => {
    const blogJSON = await guess.getAllBlog();

    res.send(blogJSON);
});

router.get('/article/:id', async (req, res) => {
    const { id } = req.params;
    const blog = await guess.getBlogDetail(Number(id));
    res.send(blog);
}) 

export default router;