import { Controller, Post, Get, Body, Route, Tags, Path, Put, Delete, Response, ValidateError } from 'tsoa';
import { Post as PostModel, CreatePostRequest } from '../models/Post';
import { databaseService } from '../services/DatabaseService';
import { NotFoundError } from '../errors/HttpError';

@Route('posts')
@Tags('Posts')
export class PostController extends Controller {

    @Get()
    public async getPosts(): Promise<PostModel[]> {
        return await databaseService.getAllPosts();
    }

    @Get('{id}')
    @Response(404, 'Post not found')
    public async getPost(@Path() id: number): Promise<PostModel> {
        const post = await databaseService.getPostById(id);
        if (!post) {
            throw new NotFoundError('Post not found');
        }
        return post;
    }

    @Post()
    public async createPost(@Body() requestBody: CreatePostRequest): Promise<PostModel> {
        const post = await databaseService.createPost(requestBody);
        this.setStatus(201);
        return post;
    }

    @Put('{id}')
    @Response(404, 'Post not found')
    public async updatePost(@Path() id: number, @Body() requestBody: Partial<CreatePostRequest>): Promise<PostModel> {
        const post = await databaseService.updatePost(id, requestBody);
        if (!post) {
            throw new NotFoundError('Post not found');
        }
        return post;
    }

    @Delete('{id}')
    @Response(404, 'Post not found')
    public async deletePost(@Path() id: number): Promise<{ message: string }> {
        const deleted = await databaseService.deletePost(id);
        if (!deleted) {
            throw new NotFoundError('Post not found');
        }
        return { message: 'Post deleted successfully' };
    }
}