import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css'],
})
export class UpdateRoleComponent implements OnInit {
  public dataRole: any;
  public errorMessage: String;
  public hide = true;

  constructor(private admin: AdminService, private router: Router) {
    this.dataRole = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {}

  update() {
    if (!this.dataRole.name || !this.dataRole.description) {
      this.errorMessage = 'Incomplete data';
      this.closeAlert();
    } else {
      this.admin.updateRole(this.dataRole).subscribe(
        (res) => {
          this.dataRole = {};
          this.router.navigate(['/listRole']);
        },
        (err) => {
          this.errorMessage = err.error;
          this.closeAlert();
          this.dataRole = {};
        }
      );
    }
  }
  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 2000);
  }
  closeX() {
    this.errorMessage = '';
  }
}
