import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
/**
 * Creates a schema for a service response
 * @param dataSchema - The schema for the data field of the response
 * @returns A Zod schema for the response object
 */
export const createServiceResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema?: T | null,
) =>
  z.object({
    status: z.number(),
    message: z.string().optional(),
    ...(dataSchema ? {data: dataSchema.optional()} : {}),
  });
/**
 * Type inferred from the service response schema
 */
export type ResponseServiceType<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof createServiceResponseSchema<T>>
>;
/**
 * Service for constructing consistent response objects
 */
export class ResponseService<T extends z.ZodTypeAny> {
  readonly response: ResponseServiceType<T>;

  private constructor(response: ResponseServiceType<T>) {
    this.response = response;
  }
  /**
   * Creates a successful response
   * @param data - The data to include in the response
   * @param message - Optional message to include in the response
   * @param status - Optional status code (default is OK)
   * @returns An instance of ResponseService with a success response
   */
  static success<T>(data: T, message?: string, status = StatusCodes.OK) {
    return new ResponseService({data, message, status});
  }
  /**
   * Creates a successful response
   * @param message - Optional message to include in the response
   * @param status - Optional status code (default is OK)
   * @returns An instance of ResponseService with a success response
   */
  static OK(message?: string, status = StatusCodes.OK) {
    return new ResponseService({message, status});
  }
  /**
   * Creates a failure response
   * @param message - The message to include in the response
   * @param status - Optional status code (default is BAD_REQUEST)
   * @returns An instance of ResponseService with a failure response
   */
  static failure(message: string, status = StatusCodes.BAD_REQUEST) {
    return new ResponseService({message, status});
  }
  /**
   * Creates a not found response
   * @param message - The message to include in the response
   * @returns An instance of ResponseService with a not found response
   */
  static notFound(message: string) {
    return new ResponseService({
      message,
      status: StatusCodes.NOT_FOUND,
    });
  }
  /**
   * Creates an internal server error response
   * @returns An instance of ResponseService with an internal server error response
   */
  static internalError() {
    return new ResponseService({
      message: 'An unexpected error occurred. Please try again later.',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
