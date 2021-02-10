import { OnInit, Component } from '@angular/core';

import { ProductService } from '../services/product.service';
import { CardService } from '../services/card.service';
import { EmployeeService } from '../services/employee.service';

import { ProductResponseModel } from '../models/product/product.respose.model';
import { EmployeeResponseModel } from '../models/employee/employee.response.model';
import { AssetResponseModel } from '../models/asset/asset.response.model';
import { CardResponseModel } from '../models/card/card.response.model';

import { interval, timer } from 'rxjs';
import { environment } from 'src/environments/environment';


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
  errorMessage: boolean = false;
  codeOrBarcode: boolean = false;

  startAdvertise : boolean = false;
  checkProduct: boolean = false;

  barcode: string ="";
  barcodeLength : number = 0;
  barcodeTemporary: string ="";
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

    this.intervalWait = setInterval(() => this.wait(), 50); 

  }

  public async wait(){

    //------------------------------------------------showSlides------------------------------------


    if(this.startAdvertise == false){
      this.startAdvertise = true;
      this.showSlides();
    }

    //------------------------------------------------ManualInput-------------------------------------

    if(this.barcode != ''){
      this.mode = 9999;
      clearInterval(this.intervalAdvertise); 
      this.barcodeTemporary = 'startAdvertise';
    }

    if((this.barcode == '')&&(this.barcodeTemporary == 'startAdvertise')){
      this.mode = 0;
      this.barcodeTemporary = '';
      this.startAdvertise = false;

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
      this.Timer(8);
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

    
    if ((this.barcode.length == 13)&&(this.mode != 9999)||(this.checkProduct)){
      try{

        this.barcodeTemporary = this.barcode;
        this.barcode = "";

        this.checkProduct = false;
        clearInterval(this.intervalAdvertise);
        this.mode = 1;
        this.errorMessage = false; 

        let stock = localStorage.getItem('stock');
        let device = localStorage.getItem('device');

        if (this.codeOrBarcode){
          this.productResponseModel = await this.productService.getProductFromCode(this.barcodeTemporary, stock, device);   
        }

        if(!this.codeOrBarcode){
          this.productResponseModel = await this.productService.getProductFromBarcode(this.barcodeTemporary, stock, device);
        }
        this.productPictureProduct = await this.productService.getPicture(this.productResponseModel.Id, stock, device);
        this.Timer(8);
       
    }

      //------------------------------------------------Card------------------------------------

      catch{  
        this.mode = 3;
        let stock = localStorage.getItem('stock');
        let device = localStorage.getItem('device');
        this.cardResponseModel = await this.cardService.getBonusCard(this.barcodeTemporary, stock, device);
        this.Timer(8);
        if (this.cardResponseModel.Id == ""){
          this.errorMessage = true; 
          this.mode = 1;
        }
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
      this.Timer(8);
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
    
    const timer$ = interval(150);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 0 + sec * 10 / seconds;
      this.curSec =  sec;
      
      if (this.progressbarValue == 100){
        sub.unsubscribe(); 
        this.progressbarValue = 0;
        this.mode = 0;
        this.errorMessage = false; 
        this.startAdvertise = false;
      }

      if ((this.barcode.length == 13)||(this.barcode.startsWith('ent'))||(this.barcode == environment.viewConfig)||(this.barcode.length !=0)){
        sub.unsubscribe();   
      }
    }); 
  }

  public async TimeNow(){

    var now = new Date();

    this.timeNow = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  }

  public async ManualRemoveLast(){

    this.barcode  = this.barcode.substring(0,this.barcode.length-2);
  }

  public async ManualFind(){
    
    if (this.barcode.length > 10){
      this.codeOrBarcode = false;
    }
    if (this.barcode.length <= 10){
      this.codeOrBarcode = true;
    }
    this.checkProduct = true;
  }
}