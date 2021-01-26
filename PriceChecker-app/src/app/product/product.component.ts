import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductResponseModel } from '../models/product/product.respose.model';
import { interval } from 'rxjs';
import { EmployeeResponseModel } from '../models/employee/employee.response.model';
import { EmployeeService } from '../services/employee.service';
import { AssetResponseModel } from '../models/asset/asset.response.model';
import { AssetService } from '../services/asset.service';
import { CardResponseModel } from '../models/card/card.response.model';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewChecked{
 
  interval: NodeJS.Timeout
  mode: number = 0;
  errorMessage: boolean = false;
  status: boolean = false;

  barcode: string ="";
  barcodeLength : number = 0;
  barcodeAsset: string ="";

  progressbarValue = 0;
  curSec: number = 0;

  productPictureProduct : HTMLImageElement
  productIconProduct : HTMLImageElement
  productAmountProduct : number
  productResponseModel : ProductResponseModel = {}
  productsResponseModel : Array<number> = []

  employeeInfoResponseModel : EmployeeResponseModel = {}
  employeeRegisterResponseModel : EmployeeResponseModel = {}

  assetResponseModel : AssetResponseModel = {}
  assetPictureResponseModel : HTMLImageElement
  cardResponseModel : CardResponseModel = {}

  constructor(private productService : ProductService,
    private employeeService : EmployeeService,
    private assetService : AssetService ) {
    }

  public async ngOnInit() {
  }

  public async wait(){
    if ((this.barcodeLength == this.barcode.length)&&(this.barcodeLength != 0)){
        this.mode++;
        clearInterval(this.interval); 
        
    }
    this.barcodeLength = this.barcode.length;
    console.log(this.barcodeLength);
    console.log(this.barcode.length);
    console.log(this.mode);
  }

  public async ngAfterViewChecked(){

    if (this.barcode == "772211002"){
      this.barcode ="";
      this.mode = 1111;
      this.interval = setInterval(() => this.wait(), 1000);        
      console.log(this.mode);
      
    }

    if (this.mode == 1112){
   
      this.interval = setInterval(() => this.wait(), 1000);        
      console.log(this.mode);
    }

    if (this.mode == 1113){
  
      this.interval = setInterval(() => this.wait(), 1000);        
      console.log(this.mode);

    } 
    if (this.mode == 1114){
  
      this.interval = setInterval(() => this.wait(), 1000);        
      console.log(this.mode);

    } 
    if (this.mode == 1115){
  
      this.interval = setInterval(() => this.wait(), 1000);        
      console.log(this.mode);

    }   
     
    if (this.barcode.startsWith('ent')){
      this.mode = 2;
      this.employeeRegisterResponseModel = await this.employeeService.registerEmployee(this.barcode);
      console.log(this.employeeRegisterResponseModel.State);
    //  this.employeeInfoResponseModel = await this.employeeService.getEmployee(this.barcode);
      this.barcode ='';
      this.Timer(8);
    }

    if (this.barcode.length == 13){
 
      try{
        this.mode = 1;
        this.productResponseModel = await this.productService.getProduct(this.barcode);
        this.barcodeAsset = this.barcode;
        this.barcode ='';
      //   this.productIconProduct = await this.productService.getIcon(this.productResponseModel.Id);
       // this.productsResponseModel = await this.productService.getProducts(this.productResponseModel.Id);
        this.productPictureProduct = await this.productService.getPicture(this.productResponseModel.Id);
        this.productAmountProduct = await this.productService.getAmount(this.productResponseModel.Id);
        this.Timer(8);
        
      }

      catch{  
        this.errorMessage = true; 
        console.log(this.errorMessage = true);
        this.Timer(8);
      }
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
        this.mode = 0;
      }
    }); 
  }

}
