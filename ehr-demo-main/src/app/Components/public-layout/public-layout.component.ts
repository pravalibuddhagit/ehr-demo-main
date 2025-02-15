import { Component } from '@angular/core';
import { MergedAppComponent } from '../merged-app/merged-app.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [RouterModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
