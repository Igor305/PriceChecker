import { OnInit, Component, HostListener } from '@angular/core';

import { ProductService } from '../services/product.service';
import { CardService } from '../services/card.service';
import { EmployeeService } from '../services/employee.service';

import { ProductResponseModel } from '../models/product/product.respose.model';
import { EmployeeResponseModel } from '../models/employee/employee.response.model';
import { AssetResponseModel } from '../models/asset/asset.response.model';
import { CardResponseModel } from '../models/card/card.response.model';

import { interval } from 'rxjs';
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
  isEmployee: boolean = false;

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

    this.intervalWait = setInterval(() => this.wait(), 200); 
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 

    if ((event.key == "Enter")&&(this.barcode.length !=0)){

      if (this.barcode.startsWith('ent')){
        this.isEmployee = true;
      }
  
      else{
        
        if (this.barcode.length > 10){
          this.codeOrBarcode = false;
        
        }
        
        if (this.barcode.length <= 10){
          this.codeOrBarcode = true;
    
        }
        this.checkProduct = true;
      }
    }
  } 
  
  public async wait(){

    //------------------------------------------------showSlides------------------------------------

    if(this.startAdvertise == false){
      this.startAdvertise = true;
      this.showSlides();
    }

    //------------------------------------------------Config------------------------------------
    
    if (this.barcode == environment.inConfig){
      clearInterval(this.intervalAdvertise); 
      this.barcode ="";
      this.barcodeTemporary ="";
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
      this.mode = 1115;
      this.timer(8);
      this.barcode ="";
      this.barcodeTemporary ="";
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

    
    if ((this.barcode.length == 13)&&(this.mode != 9999)||(this.checkProduct)&&(this.barcode.length != 0 )){
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
        this.productsResponseModel = await this.productService.getProducts(this.productResponseModel.Id, stock, device);
        
        this.timer(8);
        this.codeOrBarcode = false;
    }

    //------------------------------------------------Card------------------------------------

      catch{  
        this.mode = 3;
        let stock = localStorage.getItem('stock');
        let device = localStorage.getItem('device');
        this.cardResponseModel = await this.cardService.getBonusCard(this.barcodeTemporary, stock, device);
        this.timer(8);
        if (this.cardResponseModel.Id == ""){
          this.errorMessage = true; 
          this.mode = 1;
        }
        this.barcode ='';
      }
    }

    //------------------------------------------------companionProd------------------------------------
    
    /*console.log(this.productsResponseModel);
    console.log(this.progressbarValue);

    if((this.productResponseModel.Id > 0 )&&(this.productsResponseModel != [])){

     

        this.mode = 2;

        for(let i = 0; i < this.productsResponseModel.length; i++ ){

          console.log(i);
          this.barcode = this.productsResponseModel[i].toString() + '#';
          this.timer(8);

        
      }
    }*/

    //------------------------------------------------Employee------------------------------------

    if ((this.barcode.startsWith('ent'))&&(this.mode != 9999)||(this.isEmployee)){
      clearInterval(this.intervalAdvertise);
      this.isEmployee = false;
      this.mode = 4;
      let stock = localStorage.getItem('stock');
      let device = localStorage.getItem('device');
      this.employeeRegisterResponseModel = await this.employeeService.registerEmployee(this.barcode, stock, device );
      this.timer(8);
      this.timeEmployee();
      this.barcode ='';
    }

    //------------------------------------------------ManualInput-------------------------------------

    if((this.barcode != '')&&(this.mode != 1111)&&(this.mode != 1112)&&(this.mode != 1113)&&(this.mode != 1114)){
      
      if ((this.mode != 9999)||(this.barcodeTemporary != this.barcode)){
        this.timer(8);
      }

      if (this.barcodeTemporary == this.barcode){
        this.mode = 9999;
        clearInterval(this.intervalAdvertise); 
      }

    }
    this.barcodeTemporary = this.barcode;
  }

  //------------------------------------------------AdditionalFunc-------------------------------------

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

  public async timer(seconds: number) {
  
    const timer$ = interval(10);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 105 - sec  / seconds;
      this.curSec = sec;
      
      if (this.progressbarValue == 0){
        sub.unsubscribe(); 
        this.progressbarValue = 100;
        this.mode = 0;
        this.errorMessage = false; 
        this.startAdvertise = false;
        this.barcode = '';
      }

      if ((this.barcode.length == 13)&&(this.mode != 9999)||
      (this.barcode.startsWith('ent'))||
      (this.barcode == environment.viewConfig)||
      (this.barcode.length != this.barcodeTemporary.length )&&(this.mode == 9999)&&
      (this.barcode.length != 0 )||
      (this.mode != 9999)&&
      (this.barcode.length != 0 )){
        sub.unsubscribe();  
      }
    }); 
  }

  public async timeEmployee(){

    var now = new Date();

    this.timeNow = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  }
}