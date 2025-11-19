// src/lib/errorHandler.ts
// Centralized error handling utility

export function handleAsyncError(
  error: unknown,
  context: string,
  userMessage: string = 'An error occurred'
): void {
  // Log error for debugging
  console.error(`${context}:`, error);
  
  // Provide user feedback
  // In a production app, you might use a toast notification system
  alert(userMessage);
  
  // Optionally: send to error tracking service (Sentry, etc.)
  // trackError(error, context);
}

export async function handleApiError(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

