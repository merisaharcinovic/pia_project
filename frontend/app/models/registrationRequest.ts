export class RegistrationRequest {

  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  client: {
    firstname: string;
    lastname: string;
  } | null;
  agency: {
    name: string;
    address: string;
    PIB: string;
    description: string;
  } | null;
  profilePicture: string;
  status: string;
}
