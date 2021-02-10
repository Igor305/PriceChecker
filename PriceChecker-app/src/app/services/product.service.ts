import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProductResponseModel } from '../models/product/product.respose.model';
import { environment } from 'src/environments/environment';
import { ProductAmountResponseModel } from '../models/product/product.amount.response.model';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

constructor(private http: HttpClient, private router: Router) { }

  public async getProductFromBarcode( barcode, stock, device ): Promise<ProductResponseModel> {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.art + environment.key + environment.stock + stock + 
    environment.device + device + environment.barcode + barcode;      
    const product = await this.http.get<ProductResponseModel>(url).toPromise();

    this.productValidation(product);

    return product;
  }

  public async getProductFromCode( code, stock, device ): Promise<ProductResponseModel> {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.art + environment.key + environment.stock + stock + 
    environment.device + device + environment.code + code;      
    const product = await this.http.get<ProductResponseModel>(url).toPromise();

    this.productValidation(product);

    return product;
  }

  private productValidation(product){

    let productNameIndexOf = product.Name.indexOf('арт.');
    product.Name = product.Name.slice(0,productNameIndexOf);
    
    if (product.PriceOld != null){
      if(Number.isInteger(product.PriceOld)){
        product.PennyOld = 0;
      }
      else{
        product.PennyOld = product.PriceOld % 1 * 100;
        product.PriceOld = Math.trunc(product.PriceOld);
      }
    }

    if(Number.isInteger(product.Price)){
      product.Penny = 0;
    }
    else{
      product.Penny = product.Price % 1 * 100;
      product.Price = Math.trunc(product.Price);
    }
  }

  public async getPicture( code, stock, device ): Promise<HTMLImageElement> { 
    const url : string = environment.protocol + environment.host + environment.port +
    environment.img + environment.key + environment.stock + stock + 
    environment.device + device + environment.sticker + environment.code + code;
    const binar = await this.http.get(url,{responseType: 'blob'}).toPromise();
    let productPicture = new Blob([binar], {type: "image/jpeg"});
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(productPicture);
    var img : HTMLImageElement  = document.querySelector("#image");
    img.src = imageUrl;

    return img;
  }

  public async getIcon( code ) : Promise<HTMLImageElement> {
    const url : string = environment.protocol + environment.host + environment.port +
    environment.ico + environment.key + environment.code + code;
    const binar = await this.http.get(url,{responseType: 'blob'}).toPromise();
    let productPicture = new Blob([binar], {type: "image/ico"});
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(productPicture);

    var icon : HTMLImageElement  = document.querySelector("#ico");
    icon.src = imageUrl;

    return icon;
  }

  public async getAmount ( code, stock, device ): Promise<number> { 
    const url : string = environment.protocol + environment.host + environment.port +
    environment.totals + environment.key + environment.code + code;
    
    const list = await this.http.get<Array<ProductAmountResponseModel>>(url).toPromise();
    const amountInStock = await list.find (x =>x.StockId == stock); 
    const amount = amountInStock.Qty;

    return amount;
  }

  public async getProducts ( code ) : Promise<Array<number>>{
    const url : string = environment.protocol + environment.host + environment.port +
    environment.rel + environment.key + environment.code + code;
    
    const products = await this.http.get<Array<number>>(url).toPromise();

    return products;
  }

}