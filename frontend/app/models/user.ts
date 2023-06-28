export class User{

  username:String;
  password:String;
  email:  String;
  phone:  String;
  role: String;

  client: {
      firstname:String;
      lastname:String;
  }
  agency: {
      name:String;
      address:{
        country:string,
        city:string,
        street:string,
        number:string
      };
      PIB: String;
      description:String;
  }
  profilePicture:String;
}
