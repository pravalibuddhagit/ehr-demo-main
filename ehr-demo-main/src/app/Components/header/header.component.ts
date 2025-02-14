// import { Component } from '@angular/core';
// import { MenuModule } from 'primeng/menu';
// import { AvatarModule } from 'primeng/avatar';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-header',
//   imports: [MenuModule,AvatarModule,CommonModule],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.scss'
// })
// export class HeaderComponent {
//   items = [
//     {
//       label: 'Options',
//       items: [
//         {
//           label: 'Refresh',
//           icon: 'pi pi-refresh'
//         },
//         {
//           label: 'Export',
//           icon: 'pi pi-upload'
//         }
//       ]
//     }
//   ];
// }



import { Component, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-header',
  imports: [MenuModule,AvatarModule,CommonModule,DrawerModule,ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh'
        },
        {
          label: 'Export',
          icon: 'pi pi-upload'
        }
      ]
    }
  ];
   @ViewChild('drawerRef') drawerRef!: Drawer;
 
      closeCallback(e:Event): void {
          this.drawerRef.close(e);
      }
      visible: boolean = false;
     
}
 
