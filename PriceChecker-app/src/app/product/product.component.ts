import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductResponseModel } from '../models/product.respose.model';
import { ProductPictureResponseModel } from '../models/product.picture.response.model';
import { Binary } from '@angular/compiler';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productPictureResponseModel : ProductPictureResponseModel
  productResponseModel : ProductResponseModel = {}
  constructor(private productService : ProductService ) { }

  public async ngOnInit() {
    this.productResponseModel = await this.productService.getProduct();
    this.productPictureResponseModel = await this.productService.getPicture();
  }
}
