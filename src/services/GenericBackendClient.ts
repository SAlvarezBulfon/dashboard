abstract class GenericBackendClient<T extends DataModel<T>> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract getAll(): Promise<T[]>;

  abstract getById(id: number): Promise<T | null>;

  abstract post(data: T): Promise<T>;

  abstract put(id: number, data: T): Promise<T>;
}


export default GenericBackendClient;