import { Component } from '@angular/core';
import {MatChipAvatar} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatChipAvatar,
    MatIcon,
    MatButton
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

}
