/**
 * Type definition for the function used to monitor changes in data.
 *
 * @template T The type of data being watched.
 */
type DataObserveFunction<T> = {
  /**
   * A function that fetches the data.
   */
  fetcher: () => Promise<T | undefined | null>;

  /**
   * If true, the data monitoring is disabled.
   */
  disabled: boolean;

  /**
   * The previous data that was fetched.
   */
  previousData: T | null;

  /**
   * A function that compares the current data with the previous data to see if they're different.
   */
  isDataDifferent: (currentData: NonNullable<T>) => boolean;

  /**
   * A function that handles notifications when the data changes.
   */
  notificationHandler: (currentData: NonNullable<T>) => void;

  /**
   * Optional. A function that updates the previous data with the current data.
   */
  updatePreviousData: (currentData: NonNullable<T>) => void;
};

/**
 * Monitors for changes in data, handling notifications when the data changes.
 *
 * @template T The type of data being watched.
 * @param fetcher A function that fetches the data.
 * @param disabled If true, the data monitoring is disabled.
 * @param isDataDifferent A function that compares the current data with the previous data to see if they're different.
 * @param notificationHandler A function that handles notifications when the data changes.
 * @param updatePreviousData Optional. A function that updates the previous data with the current data.
 * @param previousData The previous data that was fetched.
 * @returns A function that fetches and compares the data.
 */
export const observeData = <T>({
  fetcher,
  disabled,
  isDataDifferent,
  notificationHandler,
  updatePreviousData,
  previousData,
}: DataObserveFunction<T>) => {
  const fetchAndCompareData = async () => {
    if (disabled) return;

    try {
      const currentData = await fetcher();
      if (!currentData) return;

      if (isDataDifferent(currentData)) {
        notificationHandler(currentData);
        updatePreviousData(currentData);
      }

      // only update if there is no previous state
      if (!previousData) {
        updatePreviousData(currentData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call right away
  return fetchAndCompareData();
};
