/* eslint-disable */
/* tslint:disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Acceptance {
    /** ID */
    id?: number;
    /**
     * Title
     * @maxLength 400
     */
    title?: string | null;
    /**
     * Name
     * @maxLength 400
     */
    name?: string | null;
    /** Status */
    status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
    /**
     * Creator
     * @minLength 1
     */
    creator?: string;
    /**
     * Moderator
     * @minLength 1
     */
    moderator?: string;
    /**
     * Formation date
     * @format date-time
     */
    formation_date?: string | null;
    /**
     * Completion date
     * @format date-time
     */
    completion_date?: string | null;
    /** Total accepted */
    total_accepted?: number | null;
    qr?: string;
}

export interface AcceptanceStatus {
    /**
     * Status
     * @minLength 1
     */
    status: string;
}

export interface Engine {
    /** ID */
    id?: number;
    /**
     * Title
     * @minLength 1
     * @maxLength 400
     */
    title: string;
    /** Description */
    description?: string | null;
    /**
     * Engine data
     * @maxLength 400
     */
    engine_data?: string | null;
    /** Status */
    status?: "active" | "deleted";
    /**
     * Image url
     * @minLength 1
     */
    image_url?: string | null;
}

export interface EngineAcceptance {
    engine: Engine;
    /** Accepted */
    accepted?: "accepted" | "rejected";
}

export interface User {
    /**
     * Имя пользователя
     * @minLength 1
     */
    username: string;
    /**
     * Пароль
     * @minLength 1
     */
    password: string;
    /** Модератор */
    is_staff?: boolean;
    /** Админ */
    is_superuser?: boolean;
}

export interface Attribute {
    name: string;
    value?: string;
}

import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

import Cookies from "js-cookie";

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
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

    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        const fromEnv = (import.meta as any).env?.VITE_API_BASE as string | undefined;
        const baseURL =
            (fromEnv && fromEnv.replace(/\/+$/, "")) ||
            (axiosConfig.baseURL as string) ||
            "http://localhost:8000/api";


        this.instance = axios.create({
            ...axiosConfig,
            baseURL,
            withCredentials: true,        // шлём cookies
            xsrfCookieName: "csrftoken",  // имя CSRF-куки Django
            xsrfHeaderName: "X-CSRFToken" // заголовок для CSRF
        });

        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
        }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
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
                                               }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }
        const csrfToken = Cookies.get('csrftoken');
        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type ? {"Content-Type": type} : {}),
                ...(csrfToken ? {'X-CSRFToken': csrfToken} : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };
}

/**
 * @title RASA API
 * @version v1
 * @license BSD License
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * RASA Web Service
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    acceptances = {
        /**
         * No description
         *
         * @tags acceptances
         * @name AcceptancesList
         * @request GET:/acceptances/
         * @secure
         */
        acceptancesList: (params?: { query?: { status?: string; date_start?: string; date_end?: string } }) =>
            this.request<void, any>({
                path: `/acceptances/`,
                method: "GET",
                secure: true,
                query: params?.query,
            }),


        /**
         * No description
         *
         * @tags acceptances
         * @name AcceptancesRead
         * @request GET:/acceptances/{id}/
         * @secure
         */
        acceptancesRead: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/acceptances/${id}/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags acceptances
         * @name AcceptancesUpdate
         * @request PUT:/acceptances/{id}/
         * @secure
         */
        acceptancesUpdate: (id: string, data: Acceptance, params: RequestParams = {}) =>
            this.request<Acceptance, any>({
                path: `/acceptances/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags acceptances
         * @name AcceptancesDelete
         * @request DELETE:/acceptances/{id}/
         * @secure
         */
        acceptancesDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/acceptances/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags acceptances
         * @name AcceptancesFormCreate
         * @request POST:/acceptances/{id}/form/
         * @secure
         */
        acceptancesFormCreate: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/acceptances/${id}/form/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags acceptances
         * @name AcceptancesModerateCreate
         * @request POST:/acceptances/{id}/moderate/
         * @secure
         */
        acceptancesModerateCreate: (id: string, data: AcceptanceStatus, params: RequestParams = {}) =>
            this.request<AcceptanceStatus, any>({
                path: `/acceptances/${id}/moderate/`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };
    engines = {
        /**
         * No description
         *
         * @tags engines
         * @name EnginesList
         * @request GET:/engines/
         * @secure
         */
        enginesList: (params?: { engine_title?: string }) =>
            this.request<void, any>({
                path: `/engines/`,
                method: "GET",
                secure: true,
                query: params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesCreate
         * @request POST:/engines/
         * @secure
         */
        enginesCreate: (data: Engine, params: RequestParams = {}) =>
            this.request<Engine, any>({
                path: `/engines/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesRead
         * @request GET:/engines/{id}/
         * @secure
         */
        enginesRead: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/engines/${id}/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesUpdate
         * @request PUT:/engines/{id}/
         * @secure
         */
        enginesUpdate: (id: number, data: Engine, params: RequestParams = {}) =>
            this.request<Engine, any>({
                path: `/engines/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesDelete
         * @request DELETE:/engines/{id}/
         * @secure
         */
        enginesDelete: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/engines/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesAddImageCreate
         * @request POST:/engines/{id}/add-image/
         * @secure
         */
        enginesAddImageCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/engines/${id}/add-image/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesAddToDraftCreate
         * @request POST:/engines/{id}/add-to-draft/
         * @secure
         */
        enginesAddToDraftCreate: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/engines/${id}/add-to-draft/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesManageDraftUpdate
         * @request PUT:/engines/{id}/manage-draft/
         * @secure
         */
        enginesManageDraftUpdate: (id: number, data: {
            accepted: string
        }, params: RequestParams = {}) =>
            this.request<EngineAcceptance, any>({
                path: `/engines/${id}/manage-draft/`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags engines
         * @name EnginesManageDraftDelete
         * @request DELETE:/engines/{id}/manage-draft/
         * @secure
         */
        enginesManageDraftDelete: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/engines/${id}/manage-draft/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    login = {
        /**
         * No description
         *
         * @tags login
         * @name LoginCreate
         * @request POST:/login/
         * @secure
         */
        loginCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/login/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
    };
    logout = {
        /**
         * No description
         *
         * @tags logout
         * @name LogoutCreate
         * @request POST:/logout/
         * @secure
         */
        logoutCreate: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/logout/`,
                method: "POST",
                secure: true,
                ...params,
            }),
    };
    profile = {
        /**
         * No description
         *
         * @tags profile
         * @name ProfileUpdate
         * @request PUT:/profile/
         * @secure
         */
        profileUpdate: (data: { id: number; username?: string; password?: string }, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/profile/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
    };
    register = {
        /**
         * No description
         *
         * @tags register
         * @name RegisterCreate
         * @request POST:/register/
         * @secure
         */
        registerCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/register/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
    };
    attributes = {
        getEngineAttributes: (id: number, params: RequestParams = {}) =>
            this.request<{ attributes: { name: string; value: string }[] }, any>({
                path: `/engines/${id}/atributes/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        addEngineAttribute: (id: number, data: Attribute, params: RequestParams = {}) =>
            this.request<{ detail: string }, any>({
                path: `/engines/${id}/atributes/`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        deleteEngineAttribute: (id: number, data: Attribute, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/engines/${id}/atributes/`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        updateEngineAttribute: (id: number, data: Attribute, params: RequestParams = {}) =>
            this.request<{ name: string; value?: string; status: "updated" | "deleted" }, any>({
                path: `/engines/${id}/atributes/`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    }
}
