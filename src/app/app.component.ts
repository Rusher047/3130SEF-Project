import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/main', icon: 'home' },
    { title: 'Search Schools', url: '/search', icon: 'search' },
    { title: 'School Rankings', url: '/ranking', icon: 'trophy' },
    { title: 'My Profile', url: '/profile', icon: 'person' },
  ];
  public labels = [];
  constructor(
    private alertController: AlertController, 
    private navCtrl: NavController,
  ) {}
  
  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          cssClass: 'alert-danger',
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}
