import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private db: AngularFirestore,
    private auth: AuthService
  ) { }

  ngOnInit() { }
  logOut() {
    this.auth.logOut();
  }

}
