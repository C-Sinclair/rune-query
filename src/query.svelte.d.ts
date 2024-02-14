type Fn = (...args: any[]) => Promise<void>;

type Cache = {
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
     * A function that will fetch the data and update the cache record
     */
    fetcher: () => void;
  };
};
