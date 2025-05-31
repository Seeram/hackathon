/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatMessageSenderEnum;
  /** @format date-time */
  timestamp: string;
  isVoiceMessage?: boolean;
  [key: string]: any;
}

export interface ChatResponse {
  message: ChatMessage;
  success: boolean;
  [key: string]: any;
}

export interface ChatRequest {
  message: string;
  /** @format double */
  ticketId?: number;
  isVoiceMessage?: boolean;
  [key: string]: any;
}

export interface VoiceRecordingResponse {
  success: boolean;
  message: string;
  transcription?: string;
  processedText?: string;
  [key: string]: any;
}

export interface AIChatLog {
  /** @format double */
  id: number;
  /** @format double */
  ticket_id: number;
  message_type: AiChatLogMessageTypeEnum;
  user_message: string;
  ai_response: string;
  voice_transcription?: string;
  session_id?: string;
  /** @format date-time */
  created_at: string;
  [key: string]: any;
}

export interface TicketAttachment {
  /** @format double */
  id: number;
  file_name: string;
  file_type: string;
  [key: string]: any;
}

export interface Ticket {
  /** @format double */
  id: number;
  ticket_number: string;
  title: string;
  description?: string;
  location?: string;
  priority: TicketPriorityEnum;
  status: TicketStatusEnum;
  /** @format double */
  assigned_technician_id: number;
  customer_name?: string;
  customer_phone?: string;
  /** @format date-time */
  scheduled_date?: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  attachments?: TicketAttachment[];
  ai_chat_logs?: AIChatLog[];
  [key: string]: any;
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  location?: string;
  priority?: CreateTicketRequestPriorityEnum;
  /** @format double */
  assigned_technician_id: number;
  customer_name?: string;
  customer_phone?: string;
  /** @format date-time */
  scheduled_date?: string;
  [key: string]: any;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  location?: string;
  priority?: UpdateTicketRequestPriorityEnum;
  status?: UpdateTicketRequestStatusEnum;
  customer_name?: string;
  customer_phone?: string;
  /** @format date-time */
  scheduled_date?: string;
  [key: string]: any;
}

export interface CreateChatLogRequestBody {
  message_type: CreateChatLogRequestBodyMessageTypeEnum;
  user_message: string;
  ai_response: string;
  voice_transcription?: string;
  session_id?: string;
  [key: string]: any;
}

export type ChatMessageSenderEnum = "user" | "llm";

export type AiChatLogMessageTypeEnum = "chat" | "voice" | "suggestion";

export type TicketPriorityEnum = "low" | "medium" | "high" | "urgent";

export type TicketStatusEnum =
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CreateTicketRequestPriorityEnum =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type UpdateTicketRequestPriorityEnum =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type UpdateTicketRequestStatusEnum =
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CreateChatLogRequestBodyMessageTypeEnum =
  | "chat"
  | "voice"
  | "suggestion";

export interface ProcessVoiceRecordingPayload {
  /** @format binary */
  audio: File;
  ticketId?: string;
}

export interface GetTicketSuggestionsPayload {
  category?: string;
  context?: string;
}

export interface GetTechnicianTicketsParams {
  status?: StatusEnum;
  /** @format double */
  technicianId: number;
}

export type StatusEnum = "assigned" | "in_progress" | "completed" | "cancelled";

export type GetTechnicianTicketsParams1StatusEnum =
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type UpdateTicketStatusStatusEnum =
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface UpdateTicketStatusPayload {
  status: UpdateTicketStatusStatusEnum;
}

export interface GetAllTicketsParams {
  status?: string;
  /** @format double */
  technicianId?: number;
  priority?: string;
}

export interface GetTicketChatLogsParams {
  /** @format double */
  limit?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  ticketId: number;
}

export namespace Tickets {
  /**
   * @description Send a chat message to the AI assistant
   * @tags AI Assistant
   * @name SendChatMessage
   * @request POST:/tickets/chat
   * @response `200` `ChatResponse` Ok
   */
  export namespace SendChatMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChatRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ChatResponse;
  }

  /**
   * @description Process voice recording and return transcription/response
   * @tags AI Assistant
   * @name ProcessVoiceRecording
   * @request POST:/tickets/voice-recording
   * @response `200` `VoiceRecordingResponse` Ok
   * @response `400` `void` Invalid audio file
   */
  export namespace ProcessVoiceRecording {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProcessVoiceRecordingPayload;
    export type RequestHeaders = {};
    export type ResponseBody = VoiceRecordingResponse;
  }

  /**
 * @description Get AI assistant suggestions for a specific ticket
 * @tags AI Assistant
 * @name GetTicketSuggestions
 * @request POST:/tickets/{ticketId}/ai-suggestions
 * @response `200` `{
    context: string,
    suggestions: (string)[],

}` Ok
 * @response `404` `void` Ticket not found
*/
  export namespace GetTicketSuggestions {
    export type RequestParams = {
      /** @format double */
      ticketId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = GetTicketSuggestionsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      context: string;
      suggestions: string[];
    };
  }

  /**
   * @description Get all tickets
   * @tags Tickets
   * @name GetAllTickets
   * @request GET:/tickets
   * @response `200` `(Ticket)[]` Ok
   */
  export namespace GetAllTickets {
    export type RequestParams = {};
    export type RequestQuery = {
      status?: string;
      /** @format double */
      technicianId?: number;
      priority?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket[];
  }

  /**
   * @description Create a new ticket
   * @tags Tickets
   * @name CreateTicket
   * @request POST:/tickets
   * @response `200` `Ticket` Ok
   */
  export namespace CreateTicket {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateTicketRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket;
  }

  /**
   * @description Get a specific ticket by ID with AI chat logs
   * @tags Tickets
   * @name GetTicket
   * @request GET:/tickets/{id}
   * @response `200` `Ticket` Ok
   * @response `404` `void` Ticket not found
   */
  export namespace GetTicket {
    export type RequestParams = {
      /** @format double */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket;
  }

  /**
   * @description Update a ticket
   * @tags Tickets
   * @name UpdateTicket
   * @request PUT:/tickets/{id}
   * @response `200` `Ticket` Ok
   * @response `404` `void` Ticket not found
   */
  export namespace UpdateTicket {
    export type RequestParams = {
      /** @format double */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateTicketRequest;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket;
  }

  /**
 * @description Delete a ticket
 * @tags Tickets
 * @name DeleteTicket
 * @request DELETE:/tickets/{id}
 * @response `200` `{
    message: string,

}` Ok
 * @response `404` `void` Ticket not found
*/
  export namespace DeleteTicket {
    export type RequestParams = {
      /** @format double */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      message: string;
    };
  }

  /**
   * @description Get all chat logs for a specific ticket
   * @tags Tickets
   * @name GetTicketChatLogs
   * @request GET:/tickets/{ticketId}/chat-logs
   * @response `200` `(AIChatLog)[]` Ok
   * @response `404` `void` Ticket not found
   */
  export namespace GetTicketChatLogs {
    export type RequestParams = {
      /** @format double */
      ticketId: number;
    };
    export type RequestQuery = {
      /** @format double */
      limit?: number;
      /** @format double */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AIChatLog[];
  }

  /**
   * @description Add a new chat log to a specific ticket
   * @tags Tickets
   * @name AddChatLogToTicket
   * @request POST:/tickets/{ticketId}/chat-logs
   * @response `200` `AIChatLog` Ok
   * @response `404` `void` Ticket not found
   */
  export namespace AddChatLogToTicket {
    export type RequestParams = {
      /** @format double */
      ticketId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateChatLogRequestBody;
    export type RequestHeaders = {};
    export type ResponseBody = AIChatLog;
  }
}

export namespace ChatLogs {
  /**
   * @description Get a specific chat log by ID
   * @tags Chat Logs
   * @name GetChatLog
   * @request GET:/chat-logs/{chatLogId}
   * @response `200` `AIChatLog` Ok
   * @response `404` `void` Chat log not found
   */
  export namespace GetChatLog {
    export type RequestParams = {
      /** @format double */
      chatLogId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AIChatLog;
  }

  /**
 * @description Delete a specific chat log by ID
 * @tags Chat Logs
 * @name DeleteChatLog
 * @request DELETE:/chat-logs/{chatLogId}
 * @response `200` `{
    message: string,

}` Ok
 * @response `404` `void` Chat log not found
*/
  export namespace DeleteChatLog {
    export type RequestParams = {
      /** @format double */
      chatLogId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      message: string;
    };
  }
}

export namespace Technicians {
  /**
   * @description Get all tickets assigned to a technician
   * @tags Technicians
   * @name GetTechnicianTickets
   * @request GET:/technicians/{technicianId}/tickets
   * @response `200` `(Ticket)[]` Ok
   */
  export namespace GetTechnicianTickets {
    export type RequestParams = {
      /** @format double */
      technicianId: number;
    };
    export type RequestQuery = {
      status?: GetTechnicianTicketsParams1StatusEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket[];
  }

  /**
   * @description Get a specific ticket by ID (must belong to technician) - no chat logs
   * @tags Technicians
   * @name GetTicket
   * @request GET:/technicians/{technicianId}/tickets/{ticketId}
   * @response `200` `Ticket` Ok
   * @response `404` `void` Ticket not found
   */
  export namespace GetTicket {
    export type RequestParams = {
      /** @format double */
      technicianId: number;
      /** @format double */
      ticketId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Ticket;
  }

  /**
 * @description Update ticket status
 * @tags Technicians
 * @name UpdateTicketStatus
 * @request PATCH:/technicians/{technicianId}/tickets/{ticketId}/status
 * @response `200` `{
    message: string,

}` Ok
 * @response `404` `void` Ticket not found
*/
  export namespace UpdateTicketStatus {
    export type RequestParams = {
      /** @format double */
      technicianId: number;
      /** @format double */
      ticketId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateTicketStatusPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      message: string;
    };
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Express TSOA API
 * @version 1.0.0
 * @baseUrl /
 *
 * A simple Express API using TSOA for TypeScript with Swagger documentation
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  tickets = {
    /**
     * @description Send a chat message to the AI assistant
     *
     * @tags AI Assistant
     * @name SendChatMessage
     * @request POST:/tickets/chat
     * @response `200` `ChatResponse` Ok
     */
    sendChatMessage: (data: ChatRequest, params: RequestParams = {}) =>
      this.request<ChatResponse, any>({
        path: `/tickets/chat`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Process voice recording and return transcription/response
     *
     * @tags AI Assistant
     * @name ProcessVoiceRecording
     * @request POST:/tickets/voice-recording
     * @response `200` `VoiceRecordingResponse` Ok
     * @response `400` `void` Invalid audio file
     */
    processVoiceRecording: (
      data: ProcessVoiceRecordingPayload,
      params: RequestParams = {},
    ) =>
      this.request<VoiceRecordingResponse, void>({
        path: `/tickets/voice-recording`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
 * @description Get AI assistant suggestions for a specific ticket
 *
 * @tags AI Assistant
 * @name GetTicketSuggestions
 * @request POST:/tickets/{ticketId}/ai-suggestions
 * @response `200` `{
    context: string,
    suggestions: (string)[],

}` Ok
 * @response `404` `void` Ticket not found
 */
    getTicketSuggestions: (
      ticketId: number,
      data: GetTicketSuggestionsPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          context: string;
          suggestions: string[];
        },
        void
      >({
        path: `/tickets/${ticketId}/ai-suggestions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all tickets
     *
     * @tags Tickets
     * @name GetAllTickets
     * @request GET:/tickets
     * @response `200` `(Ticket)[]` Ok
     */
    getAllTickets: (query: GetAllTicketsParams, params: RequestParams = {}) =>
      this.request<Ticket[], any>({
        path: `/tickets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new ticket
     *
     * @tags Tickets
     * @name CreateTicket
     * @request POST:/tickets
     * @response `200` `Ticket` Ok
     */
    createTicket: (data: CreateTicketRequest, params: RequestParams = {}) =>
      this.request<Ticket, any>({
        path: `/tickets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a specific ticket by ID with AI chat logs
     *
     * @tags Tickets
     * @name GetTicket
     * @request GET:/tickets/{id}
     * @response `200` `Ticket` Ok
     * @response `404` `void` Ticket not found
     */
    getTicket: (id: number, params: RequestParams = {}) =>
      this.request<Ticket, void>({
        path: `/tickets/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Update a ticket
     *
     * @tags Tickets
     * @name UpdateTicket
     * @request PUT:/tickets/{id}
     * @response `200` `Ticket` Ok
     * @response `404` `void` Ticket not found
     */
    updateTicket: (
      id: number,
      data: UpdateTicketRequest,
      params: RequestParams = {},
    ) =>
      this.request<Ticket, void>({
        path: `/tickets/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Delete a ticket
 *
 * @tags Tickets
 * @name DeleteTicket
 * @request DELETE:/tickets/{id}
 * @response `200` `{
    message: string,

}` Ok
 * @response `404` `void` Ticket not found
 */
    deleteTicket: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          message: string;
        },
        void
      >({
        path: `/tickets/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Get all chat logs for a specific ticket
     *
     * @tags Tickets
     * @name GetTicketChatLogs
     * @request GET:/tickets/{ticketId}/chat-logs
     * @response `200` `(AIChatLog)[]` Ok
     * @response `404` `void` Ticket not found
     */
    getTicketChatLogs: (
      { ticketId, ...query }: GetTicketChatLogsParams,
      params: RequestParams = {},
    ) =>
      this.request<AIChatLog[], void>({
        path: `/tickets/${ticketId}/chat-logs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a new chat log to a specific ticket
     *
     * @tags Tickets
     * @name AddChatLogToTicket
     * @request POST:/tickets/{ticketId}/chat-logs
     * @response `200` `AIChatLog` Ok
     * @response `404` `void` Ticket not found
     */
    addChatLogToTicket: (
      ticketId: number,
      data: CreateChatLogRequestBody,
      params: RequestParams = {},
    ) =>
      this.request<AIChatLog, void>({
        path: `/tickets/${ticketId}/chat-logs`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  chatLogs = {
    /**
     * @description Get a specific chat log by ID
     *
     * @tags Chat Logs
     * @name GetChatLog
     * @request GET:/chat-logs/{chatLogId}
     * @response `200` `AIChatLog` Ok
     * @response `404` `void` Chat log not found
     */
    getChatLog: (chatLogId: number, params: RequestParams = {}) =>
      this.request<AIChatLog, void>({
        path: `/chat-logs/${chatLogId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
 * @description Delete a specific chat log by ID
 *
 * @tags Chat Logs
 * @name DeleteChatLog
 * @request DELETE:/chat-logs/{chatLogId}
 * @response `200` `{
    message: string,

}` Ok
 * @response `404` `void` Chat log not found
 */
    deleteChatLog: (chatLogId: number, params: RequestParams = {}) =>
      this.request<
        {
          message: string;
        },
        void
      >({
        path: `/chat-logs/${chatLogId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  technicians = {
    /**
     * @description Get all tickets assigned to a technician
     *
     * @tags Technicians
     * @name GetTechnicianTickets
     * @request GET:/technicians/{technicianId}/tickets
     * @response `200` `(Ticket)[]` Ok
     */
    getTechnicianTickets: (
      { technicianId, ...query }: GetTechnicianTicketsParams,
      params: RequestParams = {},
    ) =>
      this.request<Ticket[], any>({
        path: `/technicians/${technicianId}/tickets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a specific ticket by ID (must belong to technician) - no chat logs
     *
     * @tags Technicians
     * @name GetTicket
     * @request GET:/technicians/{technicianId}/tickets/{ticketId}
     * @response `200` `Ticket` Ok
     * @response `404` `void` Ticket not found
     */
    getTicket: (
      technicianId: number,
      ticketId: number,
      params: RequestParams = {},
    ) =>
      this.request<Ticket, void>({
        path: `/technicians/${technicianId}/tickets/${ticketId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
 * @description Update ticket status
 *
 * @tags Technicians
 * @name UpdateTicketStatus
 * @request PATCH:/technicians/{technicianId}/tickets/{ticketId}/status
 * @response `200` `{
    message: string,

}` Ok
 * @response `404` `void` Ticket not found
 */
    updateTicketStatus: (
      technicianId: number,
      ticketId: number,
      data: UpdateTicketStatusPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          message: string;
        },
        void
      >({
        path: `/technicians/${technicianId}/tickets/${ticketId}/status`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
