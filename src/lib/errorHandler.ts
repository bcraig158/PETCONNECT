import { toast } from 'sonner';

export function handleAsyncError(
  error: unknown,
  context: string,
  userMessage: string = 'An error occurred',
): void {
  console.error(`${context}:`, error);
  toast.error(userMessage);
}

export async function handleApiError(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}
