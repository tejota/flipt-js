import type BatchEvaluationResponse from './@types/BatchEvaluationResponse';
import type Context from './@types/Context';
import type evaluation from './@types/Evaluation';
import type FliptConfig from './@types/FliptConfig';
import type Request from './@types/Request';
import type RequestOptions from './@types/RequestOptions';
import { BATCH_EVALUATE_ROUTE, EVALUATE_ROUTE } from './routes';

export type FlipSDKInstance = {
  evaluate(
    flagKey: string,
    entityId: string,
    context: Context,
    options?: RequestOptions,
  ): Promise<evaluation<Context>>;
  batchEvaluate(
    requests: Request[],
    options?: RequestOptions,
  ): Promise<BatchEvaluationResponse<Context>>;
};

function createFliptSDK(config: FliptConfig): FlipSDKInstance {
  if (!window.fetch)
    throw new Error("This browser doesn't support window.fetch()");

  async function evaluate(
    flagKey: string,
    entityId: string,
    context: Context,
    { requestId, signal, isAnonymous = false }: RequestOptions,
  ) {
    const response = await fetch(config.uri + EVALUATE_ROUTE, {
      headers: {
        'Content-Type': 'application/json',
        'Anonymous': JSON.stringify(isAnonymous),
      },
      method: 'POST',
      body: JSON.stringify({
        request_id: requestId,
        flag_key: flagKey,
        entity_id: entityId,
        context,
      } as Request),
      signal,
    });
    const result: evaluation<typeof context> = await response.json();
    return result;
  }

  async function batchEvaluate(
    requests: Request[],
    { requestId, signal, isAnonymous = false }: RequestOptions,
  ) {
    const response = await fetch(config.uri + BATCH_EVALUATE_ROUTE, {
      headers: {
        'Content-Type': 'application/json',
        'Anonymous': JSON.stringify(isAnonymous),
      },
      method: 'POST',
      body: JSON.stringify({
        request_id: requestId,
        requests,
      }),
      signal,
    });
    const result_1: BatchEvaluationResponse<
      typeof requests[number]['context']
    > = await response.json();
    return result_1;
  }

  return {
    evaluate,
    batchEvaluate,
  };
}

export default createFliptSDK;
