// src/routes/post.routes.ts
import { Router } from 'express';
import { postController } from '../controller/posts.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', postController.getAllPosts.bind(postController));
router.get('/:id', postController.getPostById.bind(postController));
router.post('/', authenticate, postController.createPost.bind(postController));
router.put('/:id', authenticate, postController.updatePost.bind(postController));
router.delete('/:id', authenticate, postController.deletePost.bind(postController));

export default router;