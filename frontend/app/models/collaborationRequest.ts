
import { User, ClientObject } from './user';

export class CollaborationRequest {
  _id: string;
  client: User;
  object: ClientObject;
  agency: User;
  deadline:Date;
  status: string;
  price: number;
}
