import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {

  public rolesData: any;
  public errorMessage: String;
  public successMessage: String;

  constructor(private admin: AdminService) { 
    this.rolesData = {};
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnInit(): void {
    this.admin.listRole().subscribe(
      (res)=>{
        console.log(res);
        this.rolesData = res.role;
      },
      (err)=>{
        console.log(err);
        this.errorMessage = err.error;
        this.closeAlert();
      }
    )
  }

  deleteRol(){

  }

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  closeX() {
    this.successMessage = '';
    this.errorMessage = '';
  }

}
