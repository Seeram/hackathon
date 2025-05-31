import { Controller } from 'tsoa';
import { Post as PostModel, CreatePostRequest } from '../models/Post';
export declare class PostController extends Controller {
    getPosts(): Promise<PostModel[]>;
    getPost(id: number): Promise<PostModel>;
    createPost(requestBody: CreatePostRequest): Promise<PostModel>;
    updatePost(id: number, requestBody: Partial<CreatePostRequest>): Promise<PostModel>;
    deletePost(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=PostController.d.ts.map