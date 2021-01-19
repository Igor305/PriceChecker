import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProductResponseModel } from '../models/product.respose.model';
import { ProductPictureResponseModel } from '../models/product.picture.response.model';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

constructor(private http: HttpClient, private router: Router) { }

  public async getProduct() {
    const url: string = `http://mpce04.avrora.lan/art?key=39fa302c1a6b40e19020b376c9becb3b&stock=235&device=DeviceName&barcode=2310000390178`;      
    const product = await this.http.get<ProductResponseModel>(url).toPromise();

    return product;
  }
  public async getPicture(): Promise<ProductPictureResponseModel> { 
    const url : string = 'http://mpce04.avrora.lan/img?key=39fa302c1a6b40e19020b376c9becb3b&stock=235&device=DeviceName&code=39017';
    const productPicture = await this.http.get<ProductPictureResponseModel>(url).toPromise();
    
    return productPicture;
  }
}
