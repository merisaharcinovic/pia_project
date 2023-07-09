import { User, ClientObject } from './user';

export class Review{
  rating: number;
  comment: string;
}

export class Job {
  _id?: string;
  client: User;
  agency: User;
  object: ClientObject;
  numWorkers: number;
  status: string;
  deadline:Date;
  price: number;
  review: Review
}
