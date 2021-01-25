import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ProductModule } from './product/product.module';
import { AppRoutingModule } from './app-routing.module';
import { ProductService } from './services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeService } from './services/employee.service';
import { AssetService } from './services/asset.service';
import { CardService } from './services/card.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ProductModule,
    BarcodeScannerLivestreamModule,
    BrowserAnimationsModule,
  ],
  providers: [ProductService, EmployeeService, AssetService, CardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
