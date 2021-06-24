import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  public dataUser: any;
  public errorMessage: String;
  constructor(private admin: AdminService, private router: Router) { 
    this.dataUser = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {
  }

  register(){
    if(!this.dataUser.name || !this.dataUser.email || !this.dataUser.password || !this.dataUser.roleId){
      this.errorMessage = 'Incomplete data'
      this.closeAlert();
    }else{      
      this.admin.registerAdmin(this.dataUser).subscribe(
        (res)=>{
          console.log(res);
          this.dataUser = {};
          this.router.navigate(['/listUsers']);
        },
        (err)=>{
          console.log(err)
          this.errorMessage = err.error;
          this.closeAlert();
          this.dataUser = {};
        }
      )      
    }
  }


  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  closeX() {
    this.errorMessage = '';
  }

}
