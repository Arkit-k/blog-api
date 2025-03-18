
import { Request , Response } from "express";
import { postService } from "../services/post.service"; // Ensure postService has a getPostById method
import { title } from "process";


declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}
export class PostController {
      async getAllPosts(req: Request , res: Response) {
            try {
                  const posts = await postService.getAllPosts();
                  return res.status(200).json(posts);
            } catch (error: any){
                  return res.status(500).json({ error:error. message});
            }
      }

      async getPostById(req: Request, res: Response) {
            try{
                  const { id } =  req.params;
                  const post = await postService.getPostById(parseInt(id));
                  return res.status(200).json(post);
            } catch (error: any) {
                  if (error.message === 'post not found'){
                        return res.status(400).json({error: error.message});
                  }
                  return res.status(500).json({ error: error.message});            
            }
      }

      async createPost(req: Request, res: Response) {
            try {
              const { title, content } = req.body;
              const userId = req.user!.userId;
              
              // Validate input
              if (!title || !content) {
                return res.status(400).json({ error: 'Title and content are required' });
              }
              
              const post = await postService.createPost(userId, title, content);
              return res.status(201).json(post);
            } catch (error: any) {
              return res.status(500).json({ error: error.message });
            }
          }

          async updatePost(req: Request, res: Response) {
            try {
              const { id } = req.params;
              const { title, content } = req.body;
              const userId = req.user!.userId;
              
              // Validate input
              if (!title || !content) {
                return res.status(400).json({ error: 'Title and content are required' });
              }
              
              const post = await postService.updatePost(parseInt(id), userId, title, content);
              return res.status(200).json(post);
            } catch (error: any) {
              if (error.message === 'Post not found') {
                return res.status(404).json({ error: error.message });
              }
              if (error.message === 'Not authorized to update this post') {
                return res.status(403).json({ error: error.message });
              }
              return res.status(500).json({ error: error.message });
            }
          }

          async deletePost(req: Request, res: Response) {
            try {
              const { id } = req.params;
              const userId = req.user!.userId;
              
              const result = await postService.deletePost(parseInt(id), userId);
              return res.status(200).json(result);
            } catch (error: any) {
              if (error.message === 'Post not found') {
                return res.status(404).json({ error: error.message });
              }
              if (error.message === 'Not authorized to delete this post') {
                return res.status(403).json({ error: error.message });
              }
              return res.status(500).json({ error: error.message });
            }
          }
         
}

export const postController = new PostController();