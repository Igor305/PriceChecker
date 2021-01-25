import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CardService {

    constructor(private http: HttpClient, private router: Router) { }

  public async getBonusCard( barcode ) {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.card + environment.key + environment.barcode + barcode;      
    const bonusCard = await this.http.get<CardService>(url).toPromise();

    return bonusCard;
  }
}