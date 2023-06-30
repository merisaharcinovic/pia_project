export class User {
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
  };

  profilePicture: string;
}

export class ClientObject {
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
