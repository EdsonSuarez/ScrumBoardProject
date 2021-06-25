import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  public dataUser: any;
  public errorMessage: String;
  public hiddenPass: string;
  public idUser: String;
  public emailConf: Boolean;

  constructor(
    private admin: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.dataUser = {};
    this.errorMessage = '';
    this.idUser = '';
    this.hiddenPass = 'password';
    this.emailConf = false;
    this.activatedRoute.params.subscribe((params: any) => {
      this.idUser = params.id;
    });
  }

  ngOnInit(): void {
    this.admin.getUser(this.idUser).subscribe((res) => {
      this.dataUser = res.users;
      this.dataUser.roleId = res.users.roleId.name;
    });
  }

  update() {
    if (!this.dataUser.name || !this.dataUser.email || !this.dataUser.roleId) {
      this.errorMessage = 'Incomplete data';
      this.closeAlert();
    } else {
      if (this.dataUser.password === '') delete this.dataUser.password;
      this.admin.updateUser(this.dataUser).subscribe(
        (res) => {
          console.log(res);
          this.dataUser = {};
          this.router.navigate(['/listUsers']);
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error;
          this.closeAlert();
          this.dataUser = {};
        }
      );
    }
  }

  velidEmail(email: String) {
    this.admin.emailUser(email).subscribe(
      (res) => {
        this.emailConf = res.users.length ? true : false;
        if (this.emailConf) {
          this.errorMessage = 'Email exist in db';
          this.closeAlert();
        }
      },
      (err) => {
        this.emailConf = false;
      }
    );
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
