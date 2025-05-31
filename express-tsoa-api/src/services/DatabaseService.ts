import { Client } from 'pg';
import { Post, CreatePostRequest } from '../models/Post';

export class DatabaseService {
    private client: Client;

    constructor() {
        this.client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'postgres',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            console.log('Connected to PostgreSQL database');
        } catch (error) {
            console.error('Failed to connect to database:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.end();
            console.log('Disconnected from PostgreSQL database');
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }

    async getAllPosts(): Promise<Post[]> {
        try {
            const result = await this.client.query(
                'SELECT id, title, content, author, created_at, updated_at FROM posts ORDER BY created_at DESC'
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    async getPostById(id: number): Promise<Post | null> {
        try {
            const result = await this.client.query(
                'SELECT id, title, content, author, created_at, updated_at FROM posts WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching post by id:', error);
            throw error;
        }
    }

    async createPost(postData: CreatePostRequest): Promise<Post> {
        try {
            const result = await this.client.query(
                `INSERT INTO posts (title, content, author) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, title, content, author, created_at, updated_at`,
                [postData.title, postData.content, postData.author]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async updatePost(id: number, postData: Partial<CreatePostRequest>): Promise<Post | null> {
        try {
            const setParts: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (postData.title !== undefined) {
                setParts.push(`title = $${paramCount++}`);
                values.push(postData.title);
            }
            if (postData.content !== undefined) {
                setParts.push(`content = $${paramCount++}`);
                values.push(postData.content);
            }
            if (postData.author !== undefined) {
                setParts.push(`author = $${paramCount++}`);
                values.push(postData.author);
            }

            if (setParts.length === 0) {
                throw new Error('No fields to update');
            }

            setParts.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);

            const result = await this.client.query(
                `UPDATE posts SET ${setParts.join(', ')} WHERE id = $${paramCount} 
                 RETURNING id, title, content, author, created_at, updated_at`,
                values
            );

            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    async deletePost(id: number): Promise<boolean> {
        try {
            const result = await this.client.query(
                'DELETE FROM posts WHERE id = $1',
                [id]
            );
            return (result.rowCount || 0) > 0;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
}

// Singleton instance
export const databaseService = new DatabaseService();
