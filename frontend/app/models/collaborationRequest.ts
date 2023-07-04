
import { User, ClientObject } from './user';

export class CollaborationRequest {
  _id: string;
  client: User;
  object: ClientObject;
  agency: User;
  status: string;
  price: number;
}
