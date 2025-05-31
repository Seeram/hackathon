import { Post, CreatePostRequest } from '../models/Post';
export declare class DatabaseService {
    private client;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getAllPosts(): Promise<Post[]>;
    getPostById(id: number): Promise<Post | null>;
    createPost(postData: CreatePostRequest): Promise<Post>;
    updatePost(id: number, postData: Partial<CreatePostRequest>): Promise<Post | null>;
    deletePost(id: number): Promise<boolean>;
}
export declare const databaseService: DatabaseService;
//# sourceMappingURL=DatabaseService.d.ts.map