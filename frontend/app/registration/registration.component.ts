import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

file:File;

registrationType: string = 'client';
username: string;
password: string;
confirmPassword: string;
phoneNumber: string;
email: string;
firstName: string;
lastName: string;
agencyName: string;
agencyAddress: {'country':string, 'city':string, 'street':string, 'number':string};
agencyPIB: string;
agencyDescription: string;
message: string;

  constructor(private userService:UserService,private router: Router) { }

  profilePicture: string = ""

  onProfilePictureSelected(event: any) {
    this.file= event.target.files[0];

    const image = new Image();
    image.src = URL.createObjectURL(this.file);

    const allowedFormats = ['image/jpeg', 'image/png'];
    if (!allowedFormats.includes(this.file.type)) {
      alert('Nedozvoljen format slike. Dozvoljeni formati su JPG i PNG.');
      this.profilePicture="";
      this.file=undefined;
      event.target.value = null;
      return;
    }

    image.onload = () => {
      const width = image.width;
      const height = image.height;

      if (width > 300 || width<100 || height<100 || height > 300) {
        alert('Velicina slike moze biti minimalno 100x100px, a maksimalno 300x300px.');
        this.profilePicture="";
        this.file=undefined
        event.target.value = null;
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        this.profilePicture = reader.result as string;
        console.log(this.profilePicture)

      }

    };

  }




  ngOnInit(): void {
    this.agencyAddress = {
      country: '',
      city: '',
      street: '',
      number: ''
    };
  }
  register() {

    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z].{6,11}$/
    const emailPattern= /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if(!this.username || this.username.length<1){
      this.message= 'Korisnicko ime ne sme biti prazno.'
      return
    }
    if(!this.password || !passwordPattern.test(this.password)){
      this.message = 'Lozinka u neispravnom formatu.'
      return
    }
    if(this.password!=this.confirmPassword){
      this.message = 'Lozinka i potvrda lozinke se razlikuju.'
      return
    }
    if(!this.phoneNumber){
      this.message = 'Polje telefon je obavezno.'
      return
    }
    if(!this.email || !emailPattern.test(this.email)){
      this.message = 'Email u neispravnom formatu.'
      return
    }

    this.userService.checkUsernameAndEmail(this.username, this.email).subscribe( (data:{'username':boolean, 'email':boolean})=>{
      console.log(data)
      if (data.username) {
        this.message = 'Korisnicko ime vec postoji.'
        return
      }
      else if(data.email) {
        this.message = 'Email vec postoji.'
        return
      }
      else{
        if(this.registrationType=='client'){
          if(!this.firstName || !this.lastName){
            this.message = 'Polja ime i prezime ne smeju biti prazna.'
            return
          }
          this.userService.registerClient(this.username, this.password, this.phoneNumber,
            this.email,this.firstName,this.lastName, this.profilePicture).subscribe((resp)=>{
              if(resp['message']=='ok'){
                alert('Uspesno ste se poslali zahtev za registraciju kao klijent.')
                this.userService.uploadProfilePicture(this.file, this.username).subscribe(res => this.router.navigate(['/login']))
              }
              else{
                alert('Neuspesna registracija. Pokusajte ponovo.')
                this.router.navigate(['/registration'])
              }
          })
        }
        else if(this.registrationType=='agency'){
          if(!this.agencyName){
            this.message = 'Polje naziv agencije ne sme biti prazno.'
            return
          }
          if (!this.agencyAddress.city || !this.agencyAddress.country || !this.agencyAddress.number || !this.agencyAddress.street ||
            this.agencyAddress.city.length === 0 || this.agencyAddress.country.length === 0 || this.agencyAddress.number.length === 0 || this.agencyAddress.street.length === 0) {
            this.message = 'Adresa nije u ispravnom formatu.';
            return;
          }
          if(!this.agencyPIB){
            this.message = 'Polje maticni broj agencije ne sme biti prazno.'
            return
          }
          if(!this.agencyDescription){
            this.message = 'Polje opis agencije ne sme biti prazno.'
            return
          }
          this.userService.registerAgency(this.username, this.password, this.phoneNumber,
            this.email,this.agencyName,this.agencyAddress, this.agencyPIB, this.agencyDescription, this.profilePicture).subscribe((resp)=>{
              if(resp['message']=='ok'){
                alert('Uspesno ste poslali zahtev za registraciju kao agencija.')
                this.userService.uploadProfilePicture(this.file, this.username).subscribe(res=>
                  this.router.navigate(['/login']))
              }
              else{
                alert('Neuspesna registracija. Pokusajte ponovo.')
                this.router.navigate(['/registration'])
              }
          })
        }

      }
    });

  }



}





