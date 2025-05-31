"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const tsoa_1 = require("tsoa");
const DatabaseService_1 = require("../services/DatabaseService");
const HttpError_1 = require("../errors/HttpError");
let PostController = class PostController extends tsoa_1.Controller {
    async getPosts() {
        return await DatabaseService_1.databaseService.getAllPosts();
    }
    async getPost(id) {
        const post = await DatabaseService_1.databaseService.getPostById(id);
        if (!post) {
            throw new HttpError_1.NotFoundError('Post not found');
        }
        return post;
    }
    async createPost(requestBody) {
        const post = await DatabaseService_1.databaseService.createPost(requestBody);
        this.setStatus(201);
        return post;
    }
    async updatePost(id, requestBody) {
        const post = await DatabaseService_1.databaseService.updatePost(id, requestBody);
        if (!post) {
            throw new HttpError_1.NotFoundError('Post not found');
        }
        return post;
    }
    async deletePost(id) {
        const deleted = await DatabaseService_1.databaseService.deletePost(id);
        if (!deleted) {
            throw new HttpError_1.NotFoundError('Post not found');
        }
        return { message: 'Post deleted successfully' };
    }
};
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    (0, tsoa_1.Get)('{id}'),
    (0, tsoa_1.Response)(404, 'Post not found'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPost", null);
__decorate([
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, tsoa_1.Put)('{id}'),
    (0, tsoa_1.Response)(404, 'Post not found'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, tsoa_1.Delete)('{id}'),
    (0, tsoa_1.Response)(404, 'Post not found'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
PostController = __decorate([
    (0, tsoa_1.Route)('posts'),
    (0, tsoa_1.Tags)('Posts')
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=PostController.js.map