import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatGridListModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  exports: [ProductComponent]
})
export class ProductModule { }
