type Fn = (...args: any[]) => Promise<void>;

type CacheObject = {
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
     * A function that will fetch the data and update the cache record
     */
    fetcher: () => void;
  };
};

export type Queryable<T = any> = {
  /**
   *
   * @param args -- any arguments that the fetcher function needs
   * @returns An object with a _reactive_ data getter
   */
  query: (...args: any[]) => {
    /**
     * @reactive - the data returned from the fetcher
     */
    data: T;
    /**
     * @reactive - a flag to indicate if the data is currently being fetched
     */
    loading: boolean;
  };
  /**
   * A function to manually refetch the data using the fetcher
   */
  invalidate: (...args: any[]) => void;
};

export declare function createQuery<T>(fn: Fn, expiry?: number): Queryable<T>;
