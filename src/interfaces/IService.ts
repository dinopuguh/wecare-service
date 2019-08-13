export interface IService {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(object: any, user?: any): Promise<any>;
}
