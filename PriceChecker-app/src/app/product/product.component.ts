import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductResponseModel } from '../models/product.respose.model';
import { interval } from 'rxjs';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewChecked{

  barcode: string ="";

  progressbarValue = 0;
  curSec: number = 0;

  productPictureResponseModel : HTMLImageElement
  productResponseModel : ProductResponseModel = {}

  constructor(private productService : ProductService ) { }

  public async ngOnInit() {
  }

  public async ngAfterViewChecked(){
     if (this.barcode.length == 13){
      this.productResponseModel = await this.productService.getProduct(this.barcode);
      this.productPictureResponseModel = await this.productService.getPicture(this.productResponseModel.Id);
      this.Timer(30);
      this.barcode ='';
     }
  }


  Timer(seconds: number, ) {
    var time = seconds;
    const timer$ = interval(1000);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      this.curSec =  sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }

}
