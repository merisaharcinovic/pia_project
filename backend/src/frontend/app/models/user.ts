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
    requests: Request[];
  };
  profilePicture: string;
}

export class ClientObject {
  _id: string;
  objectType: string;
  address: string;
  numRooms: number;
  area: number;
  sketch: Sketch;
}

export class Sketch {
  roomSketches: RoomSketch[];
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

export class Request {
  client: string;
  object: string;
  deadline: Date;
  status: string;
  price: number;
}
