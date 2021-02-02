import { AfterViewChecked, OnInit, Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductResponseModel } from '../models/product/product.respose.model';
import { interval } from 'rxjs';
import { EmployeeResponseModel } from '../models/employee/employee.response.model';
import { EmployeeService } from '../services/employee.service';
import { AssetResponseModel } from '../models/asset/asset.response.model';
import { CardResponseModel } from '../models/card/card.response.model';
import { environment } from 'src/environments/environment';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { keyframes } from '@angular/animations';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterViewChecked, OnInit{
 
  stock : string = "";
  device : string = "";
  ip : string = "";
  numberBody : string = "";

  interval: NodeJS.Timeout
  intervalAdvertise: NodeJS.Timeout
  mode: number = 0;
  checkConfig: number = 0;
  slideIndex : number = 0;
  startAdvertise : boolean = false;
  errorMessage: boolean = false;

  barcode: string ="";
  barcodeLength : number = 0;
  barcodeAsset: string ="";

  progressbarValue = 0;
  curSec: number = 0;

  productPictureProduct : HTMLImageElement
  productIconProduct : HTMLImageElement
  productResponseModel : ProductResponseModel = {}
  productsResponseModel : Array<number> = []

  employeeInfoResponseModel : EmployeeResponseModel = {}
  employeeRegisterResponseModel : EmployeeResponseModel = {}

  assetResponseModel : AssetResponseModel = {}
  assetPictureResponseModel : HTMLImageElement
  cardResponseModel : CardResponseModel = {}

  constructor(private productService : ProductService,
    private employeeService : EmployeeService ) {
    }

  public async ngOnInit(){

    this.stock = localStorage.getItem('stock');
    this.device = localStorage.getItem('device');
    this.ip = localStorage.getItem('ip');
    this.numberBody = localStorage.getItem('numberBody');

    if ((this.stock == null)||(this.device == null)||(this.ip == null)||(this.numberBody == null)){
      this.barcode = environment.inConfig;
    }

  }

  public async ngAfterViewChecked(){

    //------------------------------------------------Config------------------------------------
    
    if(this.startAdvertise == false){
      this.startAdvertise = true;
      this.showSlides();
    }
    
    if (this.barcode == environment.inConfig){
      clearInterval(this.intervalAdvertise); 
      this.barcode ="";
      this.mode = 1111;
      this.interval = setInterval(() => this.waitConfig(), 1000);    
      
    }
  
    if (this.checkConfig == 1){
      this.checkConfig = 2;
      this.interval = setInterval(() => this.waitConfig(), 1000);        
    }

    if (this.checkConfig == 3){
      this.checkConfig = 4;
      this.interval = setInterval(() => this.waitConfig(), 1000);        
    } 

    if (this.checkConfig == 5){772211004
      this.checkConfig = 6;
      this.interval = setInterval(() => this.waitConfig(), 1000);        
    }

    if ((this.barcode == environment.viewConfig)||(this.mode == 1115)){
      clearInterval(this.intervalAdvertise); 
      this.barcode ="";
      this.mode = 1115;
      this.stock = localStorage.getItem('stock');
      this.device = localStorage.getItem('device');
      this.ip = localStorage.getItem('ip');
      this.numberBody = localStorage.getItem('numberBody');
      this.Timer(8);
    }
    
    if (this.barcode == environment.removeConfig){
      localStorage.clear();
      
      this.barcode = "";
      this.stock = "";
      this.device = "";
      this.ip = "";
      this.numberBody = "";
      this.barcode = environment.inConfig;
    }

    //------------------------------------------------Product------------------------------------

    
    if (this.barcode.length == 13){
      clearInterval(this.intervalAdvertise);
      try{
        this.mode = 1;
        this.errorMessage = false; 
        let stock = localStorage.getItem('stock');
        let device = localStorage.getItem('device');
        this.productResponseModel = await this.productService.getProduct(this.barcode, stock, device);
        this.barcodeAsset = this.barcode;
        this.barcode ='';
     //   this.productsResponseModel = await this.productService.getProducts(this.productResponseModel.Id);
        this.productPictureProduct = await this.productService.getPicture(this.productResponseModel.Id, stock, device);
        this.Timer(8);
        
      }

      catch{  
        this.errorMessage = true; 
        this.Timer(8);
        this.barcode ='';
      }
    }

    //------------------------------------------------Employee------------------------------------

    if (this.barcode.startsWith('ent')){
      clearInterval(this.intervalAdvertise);
      this.mode = 2;
      let stock = localStorage.getItem('stock');
      let device = localStorage.getItem('device');
      this.employeeRegisterResponseModel = await this.employeeService.registerEmployee(this.barcode, stock, device );
      console.log(this.employeeRegisterResponseModel.State);
      this.barcode ='';
      this.Timer(8);
    }

  }

  public async showSlides(){

    let slides: any = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      if(this.slideIndex == i ){
        slides[i].style.display = "block";
      }
    }
    this.slideIndex++;
    if (this.slideIndex == slides.length) {
      this.slideIndex = 0;
    }    
    this.intervalAdvertise = setTimeout(() => this.showSlides(), 8000);    
  }

  public async waitConfig(){
    if ((this.barcodeLength == this.barcode.length)&&(this.barcodeLength != 0)){
      this.mode++;  
      this.checkConfig++;
      clearInterval(this.interval); 
      let number = this.barcode;
  
      if (this.barcode == environment.removeConfig)   {
        this.checkConfig -= 2;
      }
      if (this.checkConfig == 1)   {
        localStorage.setItem('stock', number);
      }
      if (this.checkConfig == 3)   {
        localStorage.setItem('device', number);
      }
      if (this.checkConfig == 5)   {
        localStorage.setItem('ip', number);
      }
      if (this.checkConfig == 7)   {
        localStorage.setItem('numberBody', number);
        this.checkConfig = 0;
        this.barcode = environment.viewConfig;
      }
  
      this.barcode = "";    
    }
    this.barcodeLength = this.barcode.length;
    this.ngAfterViewChecked();
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
        this.errorMessage = false; 
      }
      console.log(this.progressbarValue);
      if (this.barcode.length == 13){
        sub.unsubscribe();   
        this.ngAfterViewChecked();
      }
    }); 
    this.startAdvertise = false;
  }

}