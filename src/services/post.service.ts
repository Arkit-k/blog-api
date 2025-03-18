
import { users , posts } from './../db/schema';
import { db } from '../db'
import { eq , desc } from 'drizzle-orm'

export class PostService {
      async getAllPosts() {
            return db.select({
                  id: posts.id,
                  title:posts.title,
                  content:posts.content,
                  createdAt:posts.createdAt,
                  updatedAt: posts.updatedAt, // Removed as it does not exist in the schema
                  auther:{
                        id: users.id,
                        name: users.name
                  }
            })
            .from(posts)
            .innerJoin(users , eq(posts.userId,users.id))
            .orderBy(desc(posts.createdAt));
      }

      async getPostById(id:number) {
            const results = await db.select({
                  id: posts.id,
                  title:posts.title,
                  content:posts.content,
                  createdAt: posts.createdAt,
                  updatedAt: posts.updatedAt,
                  auther:{
                        id: users.id,
                        name: users.name
                  }
            })
            .from(posts)
            .innerJoin(users, eq(posts.userId,users.id))
            .where(eq(posts.id , id))
            .limit(1);

            if (results.length === 0 ) {
                  throw new Error('posts not found')
            }

            return results[0]
            }

            async createPost(userId: number , title:string, content:string) {
                  const [newPost] =  await db.insert(posts)
                  .values({
                        title,
                        content,
                        userId: userId.toString()
                  })
                  .returning();
            return this.getPostById(newPost.id)
            }
            async updatePost(id: number , userId: number , title: string, content: string) {
                  const existingPosts = await db.select()
                     .from(posts)
                     .where(eq(posts.id , id))
                     .limit(1);
                  if (existingPosts.length === 0 ) {
                        throw new Error('post not found');
                  }

                  const post = existingPosts[0];

                  if (post.userId !== userId.toString()) {
                        throw new Error('Not authorized to update this post')
                  }
                  await db.update(posts)
                  .set({
                        title,
                        content,
                        updatedAt: new Date()
                  })
                  .where(eq(posts.id, id));

                  return this.getPostById(id);
            }
            async deletePost(id: number , userId: number) {
                  const existingPosts = await db.select()
                     .from(posts)
                     .where(eq(posts.id , id))
                     .limit(1)

                  if (existingPosts.length === 0) {
                        throw new Error('post noy found');
                  }

                  await db.delete(posts)
                  .where(eq(posts.id, id));

            return { sucsess:true};
            }
}

export const postService = new PostService();