import type Context from "./Context";

type Request = {
    request_id: string,
    flag_key: string,
    entity_id: string,
    context: Context
}

export default Request;