export type Fn<T = any> = (...args: any[]) => Promise<T>;

export type CacheObject = {
  [key: string]: {
    /**
     * The time the data expires and needs to be refreshed
     */
    expiry: number;
    /**
     * The data returned from the fetcher - could be anything!
     */
    data: unknown;
    /**
     * A flag to indicate if the data is currently being fetched
     */
    loading: boolean;
    /**
     * An error object if the fetcher fails
     */
    error?: Error;
    /**
     * A function that will fetch the data and update the cache record
     */
    fetcher: () => void;
    /**
     * A list of invocation times for the fetcher
     */
    invocations: [number, number][];
  };
};

/**
 * The return type of the query function
 * @template T - the type of the data returned from the fetcher
 * When loading, data could be undefined
 */
export type QueryReturn<T = any> =
  | {
      /**
       * @reactive - the data returned from the fetcher
       */
      data: T | undefined;
      /**
       * @reactive - a flag to indicate if the data is currently being fetched
       */
      loading: true;
      error: undefined;
    }
  | {
      /**
       * @reactive - the data returned from the fetcher
       */
      data: T;
      /**
       * @reactive - a flag to indicate if the data is currently being fetched
       */
      loading: false;
      error: undefined;
    }
  | {
      /**
       * @reactive - the data returned from the fetcher
       */
      data: T | undefined;
      /**
       * @reactive - a flag to indicate if the data is currently being fetched
       */
      loading: false;
      /**
       * @reactive - an error object if the fetcher fails
       */
      error: Error;
    };

export type Queryable<T = any> = {
  /**
   *
   * @param args -- any arguments that the fetcher function needs
   * @returns An object with a _reactive_ data getter
   */
  query: (...args: any[]) => QueryReturn<T>;
  /**
   * A function to manually refetch the data using the fetcher
   */
  invalidate: (...args: any[]) => void;
};

type CreateQueryConfig = {
  /**
   * The time in milliseconds that the data will be considered fresh
   * @default 300000 - 5 minutes
   */
  expiry?: number;
  /**
   * A flag to indicate if the data should be invalidated if the fetcher fails
   * @default false - the data will not be invalidated
   */
  invalidateDataOnError?: boolean;
};

export function createQuery<T>(
  fn: Fn<T>,
  config?: CreateQueryConfig
): Queryable<T>;
