import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AssetResponseModel } from '../models/asset/asset.response.model';

@Injectable({
  providedIn: 'root'
})

export class AssetService {

    constructor(private http: HttpClient, private router: Router) { }

  public async getAsset( barcode ) {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.asset + environment.key + environment.barcode + barcode;      
    const asset = await this.http.get<AssetResponseModel>(url).toPromise();

    return asset;
  }

  public async getPicture( code ): Promise<HTMLImageElement> { 
    const url : string = environment.protocol + environment.host + environment.port +
    environment.img + environment.key + environment.code + code;
    const binar = await this.http.get(url,{responseType: 'blob'}).toPromise();
    let productPicture = new Blob([binar], {type: "image/jpeg"});
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(productPicture);
    var img : HTMLImageElement  = document.querySelector("#assetImage");
    img.src = imageUrl;

    return img;
  }
}