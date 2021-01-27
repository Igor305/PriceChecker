import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeeResponseModel } from '../models/employee/employee.response.model';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

    constructor(private http: HttpClient, private router: Router) { }

  public async getEmployee( barcode ) {
    const url: string = environment.protocol + environment.host + environment.port +
    environment.emp_info + environment.key + environment.barcode + barcode;      
    const employee = await this.http.get<EmployeeResponseModel>(url).toPromise();

    return employee;
  }

  public async registerEmployee ( barcode, stock, device ) {
      const url: string = environment.protocol + environment.host + environment.port +
      environment.emp_reg + environment.key + environment.stock + stock +
      environment.device + device + environment.barcode + barcode;
      const employee = await this.http.get<EmployeeResponseModel>(url).toPromise();

      return employee;
  }

}