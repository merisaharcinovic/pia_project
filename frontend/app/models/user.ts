export class User{

  username:string;
  password:string;
  email:  string;
  phone:  string;
  role: string;

  client: {
      firstname:string;
      lastname:string;
  }
  agency: {
      name:string;
      address:{
        country:string,
        city:string,
        street:string,
        number:string
      };
      PIB: string;
      description:string;
  }
  profilePicture:string;
}
