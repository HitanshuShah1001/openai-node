// File generated from our OpenAPI spec by Stainless.

import * as Core from 'openai/core';
import { APIResource } from 'openai/resource';
import * as Files from 'openai/resources/files';
import * as API from './index';
import { Page } from 'openai/pagination';
import { Stream } from 'openai/streaming';

export class FineTunes extends APIResource {
  /**
   * Creates a job that fine-tunes a specified model from a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about Fine-tuning](/docs/guides/fine-tuning)
   */
  create(body: FineTuneCreateParams, options?: Core.RequestOptions): Promise<Core.APIResponse<FineTune>> {
    return this.post('/fine-tunes', { body, ...options });
  }

  /**
   * Gets info about the fine-tune job.
   *
   * [Learn more about Fine-tuning](/docs/guides/fine-tuning)
   */
  retrieve(fineTuneId: string, options?: Core.RequestOptions): Promise<Core.APIResponse<FineTune>> {
    return this.get(`/fine-tunes/${fineTuneId}`, options);
  }

  /**
   * List your organization's fine-tuning jobs
   */
  list(options?: Core.RequestOptions): Core.PagePromise<FineTunesPage> {
    return this.getAPIList('/fine-tunes', FineTunesPage, options);
  }

  /**
   * Immediately cancel a fine-tune job.
   */
  cancel(fineTuneId: string, options?: Core.RequestOptions): Promise<Core.APIResponse<FineTune>> {
    return this.post(`/fine-tunes/${fineTuneId}/cancel`, options);
  }

  /**
   * Get fine-grained status updates for a fine-tune job.
   */
  listEvents(
    fineTuneId: string,
    query?: FineTuneListEventsParamsNonStreaming,
    options?: Core.RequestOptions,
  ): Promise<Core.APIResponse<FineTuneEventsListResponse>>;
  listEvents(
    fineTuneId: string,
    query: FineTuneListEventsParamsStreaming,
    options?: Core.RequestOptions,
  ): Promise<Core.APIResponse<Stream<FineTuneEvent>>>;
  listEvents(
    fineTuneId: string,
    query?: FineTuneListEventsParams,
    options?: Core.RequestOptions,
  ): Promise<Core.APIResponse<FineTuneEventsListResponse | Stream<FineTuneEvent>>>;
  listEvents(
    fineTuneId: string,
    query?: FineTuneListEventsParams | undefined,
    options?: Core.RequestOptions,
  ): Promise<Core.APIResponse<FineTuneEventsListResponse | Stream<FineTuneEvent>>> {
    return this.get(`/fine-tunes/${fineTuneId}/events`, {
      query,
      timeout: 86400000,
      ...options,
      stream: query?.stream ?? false,
    });
  }
}

/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
export class FineTunesPage extends Page<FineTune> {}
// alias so we can export it in the namespace
type _FineTunesPage = FineTunesPage;

export interface FineTune {
  id: string;

  created_at: number;

  fine_tuned_model: string | null;

  hyperparams: FineTune.Hyperparams;

  model: string;

  object: string;

  organization_id: string;

  result_files: Array<Files.FileObject>;

  status: string;

  training_files: Array<Files.FileObject>;

  updated_at: number;

  validation_files: Array<Files.FileObject>;

  events?: Array<FineTuneEvent>;
}

export namespace FineTune {
  export interface Hyperparams {
    batch_size: number;

    learning_rate_multiplier: number;

    n_epochs: number;

    prompt_loss_weight: number;

    classification_n_classes?: number;

    classification_positive_class?: string;

    compute_classification_metrics?: boolean;
  }
}

export interface FineTuneEvent {
  created_at: number;

  level: string;

  message: string;

  object: string;
}

export interface FineTuneEventsListResponse {
  data: Array<FineTuneEvent>;

  object: string;
}

export interface FineTuneCreateParams {
  /**
   * The ID of an uploaded file that contains training data.
   *
   * See [upload file](/docs/api-reference/files/upload) for how to upload a file.
   *
   * Your dataset must be formatted as a JSONL file, where each training example is a
   * JSON object with the keys "prompt" and "completion". Additionally, you must
   * upload your file with the purpose `fine-tune`.
   *
   * See the [fine-tuning guide](/docs/guides/fine-tuning/creating-training-data) for
   * more details.
   */
  training_file: string;

  /**
   * The batch size to use for training. The batch size is the number of training
   * examples used to train a single forward and backward pass.
   *
   * By default, the batch size will be dynamically configured to be ~0.2% of the
   * number of examples in the training set, capped at 256 - in general, we've found
   * that larger batch sizes tend to work better for larger datasets.
   */
  batch_size?: number | null;

  /**
   * If this is provided, we calculate F-beta scores at the specified beta values.
   * The F-beta score is a generalization of F-1 score. This is only used for binary
   * classification.
   *
   * With a beta of 1 (i.e. the F-1 score), precision and recall are given the same
   * weight. A larger beta score puts more weight on recall and less on precision. A
   * smaller beta score puts more weight on precision and less on recall.
   */
  classification_betas?: Array<number> | null;

  /**
   * The number of classes in a classification task.
   *
   * This parameter is required for multiclass classification.
   */
  classification_n_classes?: number | null;

  /**
   * The positive class in binary classification.
   *
   * This parameter is needed to generate precision, recall, and F1 metrics when
   * doing binary classification.
   */
  classification_positive_class?: string | null;

  /**
   * If set, we calculate classification-specific metrics such as accuracy and F-1
   * score using the validation set at the end of every epoch. These metrics can be
   * viewed in the
   * [results file](/docs/guides/fine-tuning/analyzing-your-fine-tuned-model).
   *
   * In order to compute classification metrics, you must provide a
   * `validation_file`. Additionally, you must specify `classification_n_classes` for
   * multiclass classification or `classification_positive_class` for binary
   * classification.
   */
  compute_classification_metrics?: boolean | null;

  /**
   * The learning rate multiplier to use for training. The fine-tuning learning rate
   * is the original learning rate used for pretraining multiplied by this value.
   *
   * By default, the learning rate multiplier is the 0.05, 0.1, or 0.2 depending on
   * final `batch_size` (larger learning rates tend to perform better with larger
   * batch sizes). We recommend experimenting with values in the range 0.02 to 0.2 to
   * see what produces the best results.
   */
  learning_rate_multiplier?: number | null;

  /**
   * The name of the base model to fine-tune. You can select one of "ada", "babbage",
   * "curie", "davinci", or a fine-tuned model created after 2022-04-21. To learn
   * more about these models, see the
   * [Models](https://platform.openai.com/docs/models) documentation.
   */
  model?: (string & {}) | 'ada' | 'babbage' | 'curie' | 'davinci' | null;

  /**
   * The number of epochs to train the model for. An epoch refers to one full cycle
   * through the training dataset.
   */
  n_epochs?: number | null;

  /**
   * The weight to use for loss on the prompt tokens. This controls how much the
   * model tries to learn to generate the prompt (as compared to the completion which
   * always has a weight of 1.0), and can add a stabilizing effect to training when
   * completions are short.
   *
   * If prompts are extremely long (relative to completions), it may make sense to
   * reduce this weight so as to avoid over-prioritizing learning the prompt.
   */
  prompt_loss_weight?: number | null;

  /**
   * A string of up to 40 characters that will be added to your fine-tuned model
   * name.
   *
   * For example, a `suffix` of "custom-model-name" would produce a model name like
   * `ada:ft-your-org:custom-model-name-2022-02-15-04-21-04`.
   */
  suffix?: string | null;

  /**
   * The ID of an uploaded file that contains validation data.
   *
   * If you provide this file, the data is used to generate validation metrics
   * periodically during fine-tuning. These metrics can be viewed in the
   * [fine-tuning results file](/docs/guides/fine-tuning/analyzing-your-fine-tuned-model).
   * Your train and validation data should be mutually exclusive.
   *
   * Your dataset must be formatted as a JSONL file, where each validation example is
   * a JSON object with the keys "prompt" and "completion". Additionally, you must
   * upload your file with the purpose `fine-tune`.
   *
   * See the [fine-tuning guide](/docs/guides/fine-tuning/creating-training-data) for
   * more details.
   */
  validation_file?: string | null;
}

export interface FineTuneListEventsParams {
  /**
   * Whether to stream events for the fine-tune job. If set to true, events will be
   * sent as data-only
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
   * as they become available. The stream will terminate with a `data: [DONE]`
   * message when the job is finished (succeeded, cancelled, or failed).
   *
   * If set to false, only events generated so far will be returned.
   */
  stream?: boolean;
}

export namespace FineTuneListEventsParams {
  export type FineTuneListEventsParamsNonStreaming = API.FineTuneListEventsParamsNonStreaming;
  export type FineTuneListEventsParamsStreaming = API.FineTuneListEventsParamsStreaming;
}

export interface FineTuneListEventsParamsNonStreaming extends FineTuneListEventsParams {
  /**
   * Whether to stream events for the fine-tune job. If set to true, events will be
   * sent as data-only
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
   * as they become available. The stream will terminate with a `data: [DONE]`
   * message when the job is finished (succeeded, cancelled, or failed).
   *
   * If set to false, only events generated so far will be returned.
   */
  stream?: false;
}

export interface FineTuneListEventsParamsStreaming extends FineTuneListEventsParams {
  /**
   * Whether to stream events for the fine-tune job. If set to true, events will be
   * sent as data-only
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
   * as they become available. The stream will terminate with a `data: [DONE]`
   * message when the job is finished (succeeded, cancelled, or failed).
   *
   * If set to false, only events generated so far will be returned.
   */
  stream: true;
}

export namespace FineTunes {
  export import FineTune = API.FineTune;
  export import FineTuneEvent = API.FineTuneEvent;
  export import FineTuneEventsListResponse = API.FineTuneEventsListResponse;
  export type FineTunesPage = _FineTunesPage;
  export import FineTuneCreateParams = API.FineTuneCreateParams;
  export import FineTuneListEventsParams = API.FineTuneListEventsParams;
  export import FineTuneListEventsParamsNonStreaming = API.FineTuneListEventsParamsNonStreaming;
  export import FineTuneListEventsParamsStreaming = API.FineTuneListEventsParamsStreaming;
}