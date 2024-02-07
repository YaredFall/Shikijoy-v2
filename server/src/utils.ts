export const LINKS = {
    pupflare: "http://localhost:8080",
    animejoy: "https://animejoy.ru",
} as const;

export type ServerErrorName = "FetchError" | "ClientError" | "ServerError" | "UnhandledError" | string & Record<never, never>;
export class ServerError<TData> extends Error {

    name: ServerErrorName;
    data?: TData;

    constructor(name: ServerErrorName, message: string, data?: TData) {
        super(message);
        this.name = name;
        this.data = data;
    }

    toJSON() {
        return ({
            name: this.name,
            message: this.message,
            data: this.data,
        });
    }
}