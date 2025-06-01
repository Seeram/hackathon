"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const AIAssistantController_1 = require("./../controllers/AIAssistantController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const ChatLogController_1 = require("./../controllers/ChatLogController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const TicketController_1 = require("./../controllers/TicketController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const TicketController_2 = require("./../controllers/TicketController");
const multer = require('multer');
const upload = multer();
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "ChatMessage": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "text": { "dataType": "string", "required": true },
            "sender": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["user"] }, { "dataType": "enum", "enums": ["llm"] }], "required": true },
            "timestamp": { "dataType": "datetime", "required": true },
            "isVoiceMessage": { "dataType": "boolean" },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChatResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "ref": "ChatMessage", "required": true },
            "success": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChatRequest": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "ticketId": { "dataType": "double" },
            "isVoiceMessage": { "dataType": "boolean" },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VoiceRecordingResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "transcription": { "dataType": "string" },
            "processedText": { "dataType": "string" },
            "confidence": { "dataType": "double" },
            "sources": { "dataType": "array", "array": { "dataType": "string" } },
            "processingTime": { "dataType": "double" },
            "fileInfo": { "dataType": "any" },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AIChatLog": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "ticket_id": { "dataType": "double", "required": true },
            "message_type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["chat"] }, { "dataType": "enum", "enums": ["voice"] }, { "dataType": "enum", "enums": ["suggestion"] }], "required": true },
            "user_message": { "dataType": "string", "required": true },
            "ai_response": { "dataType": "string", "required": true },
            "voice_transcription": { "dataType": "string" },
            "session_id": { "dataType": "string" },
            "created_at": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketAttachment": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "file_name": { "dataType": "string", "required": true },
            "file_type": { "dataType": "string", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Ticket": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "ticket_number": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string" },
            "location": { "dataType": "string" },
            "priority": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["low"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["high"] }, { "dataType": "enum", "enums": ["urgent"] }], "required": true },
            "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["assigned"] }, { "dataType": "enum", "enums": ["in_progress"] }, { "dataType": "enum", "enums": ["completed"] }, { "dataType": "enum", "enums": ["cancelled"] }], "required": true },
            "assigned_technician_id": { "dataType": "double", "required": true },
            "customer_name": { "dataType": "string" },
            "customer_phone": { "dataType": "string" },
            "scheduled_date": { "dataType": "datetime" },
            "created_at": { "dataType": "datetime", "required": true },
            "updated_at": { "dataType": "datetime", "required": true },
            "attachments": { "dataType": "array", "array": { "dataType": "refObject", "ref": "TicketAttachment" } },
            "ai_chat_logs": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AIChatLog" } },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateTicketRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string" },
            "location": { "dataType": "string" },
            "priority": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["low"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["high"] }, { "dataType": "enum", "enums": ["urgent"] }] },
            "assigned_technician_id": { "dataType": "double", "required": true },
            "customer_name": { "dataType": "string" },
            "customer_phone": { "dataType": "string" },
            "scheduled_date": { "dataType": "datetime" },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTicketRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string" },
            "description": { "dataType": "string" },
            "location": { "dataType": "string" },
            "priority": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["low"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["high"] }, { "dataType": "enum", "enums": ["urgent"] }] },
            "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["assigned"] }, { "dataType": "enum", "enums": ["in_progress"] }, { "dataType": "enum", "enums": ["completed"] }, { "dataType": "enum", "enums": ["cancelled"] }] },
            "customer_name": { "dataType": "string" },
            "customer_phone": { "dataType": "string" },
            "scheduled_date": { "dataType": "datetime" },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateChatLogRequestBody": {
        "dataType": "refObject",
        "properties": {
            "message_type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["chat"] }, { "dataType": "enum", "enums": ["voice"] }, { "dataType": "enum", "enums": ["suggestion"] }], "required": true },
            "user_message": { "dataType": "string", "required": true },
            "ai_response": { "dataType": "string", "required": true },
            "voice_transcription": { "dataType": "string" },
            "session_id": { "dataType": "string" },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/api/tickets/chat', ...((0, runtime_1.fetchMiddlewares)(AIAssistantController_1.AIAssistantController)), ...((0, runtime_1.fetchMiddlewares)(AIAssistantController_1.AIAssistantController.prototype.sendChatMessage)), function AIAssistantController_sendChatMessage(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ChatRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new AIAssistantController_1.AIAssistantController();
            const promise = controller.sendChatMessage.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/tickets/voice-recording', upload.single('audio'), ...((0, runtime_1.fetchMiddlewares)(AIAssistantController_1.AIAssistantController)), ...((0, runtime_1.fetchMiddlewares)(AIAssistantController_1.AIAssistantController.prototype.processVoiceRecording)), function AIAssistantController_processVoiceRecording(request, response, next) {
        const args = {
            audioFile: { "in": "formData", "name": "audio", "required": true, "dataType": "file" },
            ticketId: { "in": "formData", "name": "ticketId", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new AIAssistantController_1.AIAssistantController();
            const promise = controller.processVoiceRecording.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/tickets/:ticketId/ai-suggestions', ...((0, runtime_1.fetchMiddlewares)(AIAssistantController_1.AIAssistantController)), ...((0, runtime_1.fetchMiddlewares)(AIAssistantController_1.AIAssistantController.prototype.getTicketSuggestions)), function AIAssistantController_getTicketSuggestions(request, response, next) {
        const args = {
            ticketId: { "in": "path", "name": "ticketId", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "category": { "dataType": "string" }, "context": { "dataType": "string" } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new AIAssistantController_1.AIAssistantController();
            const promise = controller.getTicketSuggestions.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/chat-logs/:chatLogId', ...((0, runtime_1.fetchMiddlewares)(ChatLogController_1.ChatLogController)), ...((0, runtime_1.fetchMiddlewares)(ChatLogController_1.ChatLogController.prototype.getChatLog)), function ChatLogController_getChatLog(request, response, next) {
        const args = {
            chatLogId: { "in": "path", "name": "chatLogId", "required": true, "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new ChatLogController_1.ChatLogController();
            const promise = controller.getChatLog.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/chat-logs/:chatLogId', ...((0, runtime_1.fetchMiddlewares)(ChatLogController_1.ChatLogController)), ...((0, runtime_1.fetchMiddlewares)(ChatLogController_1.ChatLogController.prototype.deleteChatLog)), function ChatLogController_deleteChatLog(request, response, next) {
        const args = {
            chatLogId: { "in": "path", "name": "chatLogId", "required": true, "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new ChatLogController_1.ChatLogController();
            const promise = controller.deleteChatLog.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/technicians/:technicianId/tickets', ...((0, runtime_1.fetchMiddlewares)(TicketController_1.TechnicianController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_1.TechnicianController.prototype.getTechnicianTickets)), function TechnicianController_getTechnicianTickets(request, response, next) {
        const args = {
            technicianId: { "in": "path", "name": "technicianId", "required": true, "dataType": "double" },
            status: { "in": "query", "name": "status", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["assigned"] }, { "dataType": "enum", "enums": ["in_progress"] }, { "dataType": "enum", "enums": ["completed"] }, { "dataType": "enum", "enums": ["cancelled"] }] },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_1.TechnicianController();
            const promise = controller.getTechnicianTickets.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/technicians/:technicianId/tickets/:ticketId', ...((0, runtime_1.fetchMiddlewares)(TicketController_1.TechnicianController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_1.TechnicianController.prototype.getTicket)), function TechnicianController_getTicket(request, response, next) {
        const args = {
            technicianId: { "in": "path", "name": "technicianId", "required": true, "dataType": "double" },
            ticketId: { "in": "path", "name": "ticketId", "required": true, "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_1.TechnicianController();
            const promise = controller.getTicket.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/api/technicians/:technicianId/tickets/:ticketId/status', ...((0, runtime_1.fetchMiddlewares)(TicketController_1.TechnicianController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_1.TechnicianController.prototype.updateTicketStatus)), function TechnicianController_updateTicketStatus(request, response, next) {
        const args = {
            technicianId: { "in": "path", "name": "technicianId", "required": true, "dataType": "double" },
            ticketId: { "in": "path", "name": "ticketId", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["assigned"] }, { "dataType": "enum", "enums": ["in_progress"] }, { "dataType": "enum", "enums": ["completed"] }, { "dataType": "enum", "enums": ["cancelled"] }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_1.TechnicianController();
            const promise = controller.updateTicketStatus.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/tickets', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.getAllTickets)), function TicketController_getAllTickets(request, response, next) {
        const args = {
            status: { "in": "query", "name": "status", "dataType": "string" },
            technicianId: { "in": "query", "name": "technicianId", "dataType": "double" },
            priority: { "in": "query", "name": "priority", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.getAllTickets.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/tickets/:id', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.getTicket)), function TicketController_getTicket(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.getTicket.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/tickets', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.createTicket)), function TicketController_createTicket(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CreateTicketRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.createTicket.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/tickets/:id', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.updateTicket)), function TicketController_updateTicket(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UpdateTicketRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.updateTicket.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/tickets/:id', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.deleteTicket)), function TicketController_deleteTicket(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.deleteTicket.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/tickets/:ticketId/chat-logs', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.getTicketChatLogs)), function TicketController_getTicketChatLogs(request, response, next) {
        const args = {
            ticketId: { "in": "path", "name": "ticketId", "required": true, "dataType": "double" },
            limit: { "in": "query", "name": "limit", "dataType": "double" },
            offset: { "in": "query", "name": "offset", "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.getTicketChatLogs.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/tickets/:ticketId/chat-logs', ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController)), ...((0, runtime_1.fetchMiddlewares)(TicketController_2.TicketController.prototype.addChatLogToTicket)), function TicketController_addChatLogToTicket(request, response, next) {
        const args = {
            ticketId: { "in": "path", "name": "ticketId", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CreateChatLogRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new TicketController_2.TicketController();
            const promise = controller.addChatLogToTicket.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200);
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "ignore" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "ignore" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=routes.js.map