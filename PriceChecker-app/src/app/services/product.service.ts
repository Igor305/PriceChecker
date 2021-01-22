import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProductResponseModel } from '../models/product.respose.model';
import { environment } from 'src/environments/environment';
import { ProductAmountResponseModel } from '../models/product.amount.response.model';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

constructor(private http: HttpClient, private router: Router) { }

  public async getProduct( barcode ) {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.art + environment.key + environment.barcode + barcode;      
    const product = await this.http.get<ProductResponseModel>(url).toPromise();

    return product;
  }

  public async getPicture( code ): Promise<HTMLImageElement> { 
    const url : string = environment.protocol + environment.host + environment.port +
    environment.img + environment.key + environment.code + code;
    const binar = await this.http.get(url,{responseType: 'blob'}).toPromise();
    let productPicture = new Blob([binar], {type: "image/jpeg"});
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(productPicture);
    var img = document.querySelector("#image").src = imageUrl;

    return img;
  }

  public async getAmount ( code ): Promise<number> { 
    const url : string = environment.protocol + environment.host + environment.port +
    environment.totals + environment.key + environment.code + code;
    
    const list = await this.http.get<Array<ProductAmountResponseModel>>(url).toPromise();

    const amountInStock = list.find (x =>x.StockId == 2); 
    const amount = amountInStock.Qty;

    return amount;
  }

}
