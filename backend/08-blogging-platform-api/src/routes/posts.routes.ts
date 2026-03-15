import { Router, type Request, type Response } from 'express';
import * as posts from '@/controller/posts.controller.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const searchTerms = req.query.terms as string;

  if (!searchTerms) {
    const allPosts = await posts.getAllPosts();
    return res.status(200).send(allPosts);
  }

  const searchResults = await posts.searchPosts(searchTerms);
  return res.status(200).send(searchResults);
});

router.post('/', async (req: Request, res: Response) => {
  const { title, content, category, tags } = req.body;

  const newPost = await posts.addPost(title, content, category, tags);
  if (!newPost) {
    res.status(400).json({
      error: 'bad request',
      message: 'title and content fields is required',
    });
  }
  return res.status(201).send(newPost);
});

router.get('/:id', async (req: Request, res: Response) => {
  const post_id = Number(req.params.id);

  const Post = await posts.getSinglePost(post_id);
  if (!Post) {
    return res.status(404).json({
      error: 'resource not found',
      message: `no post is found with id: ${post_id}`,
    });
  }
  return res.status(200).send(Post);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { title, content, category, tags } = req.body;
  const post_id = Number(req.params.id);

  const updatedPost = await posts.updatePost(
    post_id,
    title,
    content,
    category,
    tags,
  );

  if (updatedPost === 400) {
    return res.status(400).json({
      error: 'bad requests',
      message: `title and content fields is required`,
    });
  } else if (!updatedPost) {
    return res.status(404).json({
      error: 'Resource not found',
      message: `No posts found with ID: ${post_id}`,
    });
  }

  return res.status(200).send(updatedPost);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const post_id = Number(req.params.id);

  const deleteResults = await posts.deletePost(post_id);
  if (!deleteResults) {
    return res.status(404).json({ error: `post id: ${post_id} not found` });
  }

  return res.status(204).send();
});

export default router;
