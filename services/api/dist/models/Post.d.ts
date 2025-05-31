export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface CreatePostRequest {
    title: string;
    content: string;
    author: string;
}
//# sourceMappingURL=Post.d.ts.map