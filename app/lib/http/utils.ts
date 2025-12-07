import { FetchError } from "~/lib/http"

export function isNetworkError<T>(err: unknown): err is FetchError<T> {
    return err instanceof FetchError
}
