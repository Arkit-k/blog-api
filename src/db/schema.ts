import {pgTable , serial , text, timestamp, integer , uuid} from 'drizzle-orm/pg-core';
import { title } from 'process';


export const users = pgTable('users',{
      id: serial('id').primaryKey(),
      email: text('email').notNull().unique(),
      passwordHash:text('password_hash').notNull(),
      name:text('name').notNull(),
      createdAt:timestamp('created_at').defaultNow().notNull()
});

export const posts = pgTable('posts', {
      id:serial('id').primaryKey(),
      title: text('title').notNull(),
      content:text('content').notNull(),
      userid: text('user_id').references(() => users.id).notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
})
export const comments = pgTable('comments', {
      id: serial('id').primaryKey(),
      content : text('content').notNull(),
      postid: integer('post_id').references(() => posts.id).notNull(),
      userid: integer('user_id').references(()=> users.id).notNull(),
      createdAt:timestamp('created_at').defaultNow().notNull()
});