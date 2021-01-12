import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import { StudentService } from '../entities/student/student.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;

  constructor(public navController: NavController, private accountService: AccountService, private loginService: LoginService, private studentService: StudentService) { }

  ngOnInit() {
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
        this.loadStudentData()
      }
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }
  loadStudentData() {
    this.studentService.find(this.account.id).subscribe(res => {
      console.log(res.body.faculty);
      localStorage.setItem('project', JSON.stringify(res.body.project));
      localStorage.setItem('faculty', JSON.stringify(res.body.faculty));
    })
  }
}
