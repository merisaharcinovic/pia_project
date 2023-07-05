import { User, ClientObject } from './user';

export class Job {
  _id: string;
  client: User;
  agency: User;
  object: ClientObject;
  numWorkers: number;
  status: string;
  price: number;
}
