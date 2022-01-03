import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { interval } from 'rxjs';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  y: number = 0;
  x: number = 0;
  value: number = 0;

  public options: any = {
    chart: {
      type: 'scatter',
      height: 700
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: () => {
        return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          ' y: ' + this.y.toFixed(2);
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: () => {
          return Highcharts.dateFormat('%e %b %y', this.value);
        }
      }
    },
    series: [
      {
        name: 'Normal',
        turboThreshold: 500000,
        data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
      },
      {
        name: 'Abnormal',
        turboThreshold: 500000,
        data: [[new Date('2018-02-05 18:38:31').getTime(), 7]]
      }
    ]
  }
  subscription: any;
  constructor(private http: HttpClient) { }

  ngOnInit(){
    // Set 10 seconds interval to update data again and again
    const source = interval(10000);

    // Sample API
    const apiLink = 'https://bit.ly/2QTDBJ7';

    this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
      (      data: any[]) => {
        const updated_normal_data: any[][] = [];
        const updated_abnormal_data: any[][] = [];
        data.forEach((row: { timestamp: string | number | Date; value: any; Normal: number; }) => {
          const temp_row = [
            new Date(row.timestamp).getTime(),
            Number(row.value)
          ];
          row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
        });

        

        this.options.series[0]['data'] = updated_normal_data;
        this.options.series[1]['data'] = updated_abnormal_data;

        console.log(this.options.series);
        Highcharts.chart('container', this.options);
      },
      (      error: any) => {
        console.log('Something went wrong.');
      })
    );
  }

  getApiResponse(url: string) {
    return this.http.get(url, {})
      .toPromise().then((res: any) => {
        return res;
      });
  }
}
