export class User {
  _id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  client: {
    firstname: string;
    lastname: string;
    objects: ClientObject[];
  };
  agency: {
    name: string;
    address: {
      country: string;
      city: string;
      street: string;
      number: string;
    };
    PIB: string;
    description: string;
    workers: Worker[];
  };
  profilePicture: string;
}

export class ClientObject {
  _id: string;
  objectType: string;
  address: string;
  numRooms: number;
  area: number;
  sketch: RoomSketch[];
}

export class RoomSketch {
  x: number;
  y: number;
  width: number;
  height: number;
  door: {
    x: number;
    y: number;
  };
}

export class Worker {
  _id:string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  specialization: string;
}
