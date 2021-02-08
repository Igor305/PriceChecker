import { OnInit, Component, ModuleWithComponentFactories } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductResponseModel } from '../models/product/product.respose.model';
import { interval } from 'rxjs';
import { EmployeeResponseModel } from '../models/employee/employee.response.model';
import { EmployeeService } from '../services/employee.service';
import { AssetResponseModel } from '../models/asset/asset.response.model';
import { CardResponseModel } from '../models/card/card.response.model';
import { environment } from 'src/environments/environment';
import { CardService } from '../services/card.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements  OnInit{
 
  stock : string = "";
  device : string = "";
  ip : string = "";
  numberBody : string = "";

  intervalConfig: NodeJS.Timeout
  intervalAdvertise: NodeJS.Timeout
  intervalWait: NodeJS.Timeout
  stopTimer: boolean = false 
  mode: number = 0;
  checkConfig: number = 0;
  slideIndex : number = 0;
  startAdvertise : boolean = false;
  errorMessage: boolean = false;

  barcode: string ="";
  barcodeLength : number = 0;
  barcodeAsset: string ="";
  timeNow: string ="";

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

  constructor(
    private productService : ProductService,
    private employeeService : EmployeeService,
    private cardService : CardService) {
    }

  public async ngOnInit(){

    this.stock = localStorage.getItem('stock');
    this.device = localStorage.getItem('device');
    this.ip = localStorage.getItem('ip');
    this.numberBody = localStorage.getItem('numberBody');

    if ((this.stock == null)||(this.device == null)||(this.ip == null)||(this.numberBody == null)){
      this.barcode = environment.inConfig;
    }

    this.intervalWait = setInterval(() => this.wait(), 100); 

  }

  public async wait(){

    //console.log(this.barcode);
    
    //------------------------------------------------showSlides------------------------------------

    if(this.startAdvertise == false){
      this.startAdvertise = true;
      this.showSlides();
    }

    //------------------------------------------------Config------------------------------------
    
    if (this.barcode == environment.inConfig){
      clearInterval(this.intervalAdvertise); 
      this.barcode ="";
      this.mode = 1111;
      this.intervalConfig = setInterval(() => this.waitConfig(), 1000);    
      
    }
  
    if (this.checkConfig == 1){
      this.checkConfig = 2;
      this.intervalConfig = setInterval(() => this.waitConfig(), 1000);        
    }

    if (this.checkConfig == 3){
      this.checkConfig = 4;
      this.intervalConfig = setInterval(() => this.waitConfig(), 1000);        
    } 

    if (this.checkConfig == 5){
      this.checkConfig = 6;
      this.intervalConfig = setInterval(() => this.waitConfig(), 1000);        
    }

    if ((this.barcode == environment.viewConfig)){
      clearInterval(this.intervalAdvertise); 
      if (this.barcode == environment.viewConfig){
        this.mode = 1115;
      }
      this.Timer(80);
      this.barcode ="";
      this.stock = localStorage.getItem('stock');
      this.device = localStorage.getItem('device');
      this.ip = localStorage.getItem('ip');
      this.numberBody = localStorage.getItem('numberBody');
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
      try{
        clearInterval(this.intervalAdvertise);
        this.Timer(80);
        this.mode = 1;
        this.errorMessage = false; 
        let stock = localStorage.getItem('stock');
        let device = localStorage.getItem('device');
        this.productResponseModel = await this.productService.getProduct(this.barcode, stock, device);
        this.barcodeAsset = this.barcode;
     //   this.productsResponseModel = await this.productService.getProducts(this.productResponseModel.Id);
        this.productPictureProduct = await this.productService.getPicture(this.productResponseModel.Id, stock, device);
 
      }

      //------------------------------------------------Card------------------------------------

      catch{  
        //this.errorMessage = true; 
        this.Timer(80);
        let stock = localStorage.getItem('stock');
        let device = localStorage.getItem('device');
        this.cardResponseModel = await this.cardService.getBonusCard(this.barcode, stock, device);
        this.mode = 3;
        this.barcode ='';
      }
    }

    //------------------------------------------------Employee------------------------------------

    if (this.barcode.startsWith('ent')){
      clearInterval(this.intervalAdvertise);
      this.Timer(80);
      this.mode = 2;
      let stock = localStorage.getItem('stock');
      let device = localStorage.getItem('device');
      this.employeeRegisterResponseModel = await this.employeeService.registerEmployee(this.barcode, stock, device );
      this.TimeNow();
      this.barcode ='';

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
      clearInterval(this.intervalConfig); 
      let number = this.barcode;
  
      if (this.barcode == environment.removeConfig)   {
        this.checkConfig -= 2;
        this.barcode = "";  
      }
      if (this.checkConfig == 1)   {
        localStorage.setItem('stock', number);
        this.barcode = "";  
      }
      if (this.checkConfig == 3)   {
        localStorage.setItem('device', number);
        this.barcode = "";  
      }
      if (this.checkConfig == 5)   {
        localStorage.setItem('ip', number);        
        this.barcode = "";  
      }
      if (this.checkConfig == 7)   {
        localStorage.setItem('numberBody', number);
        this.checkConfig = 0;
        this.barcode = environment.viewConfig;
      }

    }
    this.barcodeLength = this.barcode.length;
  }

  public async Timer(seconds: number) {
    if (this.progressbarValue != 0){
      this.progressbarValue == 0
      this.stopTimer = true;
    }
    this.progressbarValue = 0;
    const timer$ = interval(100);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 0 + sec * 100 / seconds;
      this.curSec =  sec;
      
      if(this.stopTimer){
        sub.unsubscribe();
        this.stopTimer = false;
      } 

      if (this.progressbarValue == 100){
        sub.unsubscribe(); 
        this.progressbarValue = 0;
        this.mode = 0;
        this.errorMessage = false; 
        this.startAdvertise = false;
      }
      if (this.barcode.length == 13){
        sub.unsubscribe();   
      }
    }); 
  }

  public async TimeNow(){

    var now = new Date();

    this.timeNow = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  }
}