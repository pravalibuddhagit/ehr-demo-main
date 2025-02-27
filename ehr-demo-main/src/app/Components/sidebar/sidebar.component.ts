import { Component } from '@angular/core';
import { 
  RouterLink, RouterModule} from '@angular/router';

  import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  imports: [  RouterModule,PanelMenu],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

 

}
