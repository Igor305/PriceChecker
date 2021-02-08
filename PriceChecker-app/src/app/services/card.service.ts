import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CardResponseModel } from '../models/card/card.response.model';

@Injectable({
  providedIn: 'root'
})

export class CardService {

    constructor(private http: HttpClient, private router: Router) { }

  public async getBonusCard( card , stock, device ) {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.card + environment.key + environment.stock + stock +
    environment.device + device + environment.ncard + card;      
    const bonusCard = await this.http.get<CardResponseModel>(url).toPromise();

    return bonusCard;
  }
}