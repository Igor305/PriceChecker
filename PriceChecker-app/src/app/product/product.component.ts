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

  mode: boolean = false;
  errorMessage: boolean = false;

  barcode: string ="";


  progressbarValue = 0;
  curSec: number = 0;

  productPictureProduct : HTMLImageElement
  productAmountProduct : number
  productResponseModel : ProductResponseModel = {}


  constructor(private productService : ProductService ) {}

  public async ngOnInit() {
  }

  public async ngAfterViewChecked(){
    if (this.barcode.length == 13){
 
      try{
        this.mode = true;
        console.log(this.mode);
        this.productResponseModel = await this.productService.getProduct(this.barcode);
        this.barcode ='';
        this.productPictureProduct = await this.productService.getPicture(this.productResponseModel.Id);
        this.productAmountProduct = await this.productService.getAmount(this.productResponseModel.Id);
        this.Timer(8);

      }
      catch{
        this.barcode ='';
        this.errorMessage = true; 
        this.Timer(8);
      }
      console.log(this.mode);
    }

  }

  Timer(seconds: number) {
    var time = seconds;
    const timer$ = interval(1000);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      this.curSec =  sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
      if (this.progressbarValue == 0){
        this.mode = false;
      }
    }); 
  }

}
