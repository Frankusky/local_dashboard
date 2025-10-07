export async function withDB<T>(
  operation: () => Promise<T>,
  errorMessage: string = "Error with the operation"
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  }
}
