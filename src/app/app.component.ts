import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  name = 'Angular   6';
  canvas: any;
  ctx: any;
  chart: any;
  @ViewChild('myChart') myChart: ElementRef;
  public gauge = {
    id: 'custom',
    afterDatasetDraw: (chart: any, arg: any, options: any) => {
      const { ctx, config, data, chartArea } = chart;
      console.log(chart);
      if (config.type === 'doughnut') {
        const dataTotal = data.datasets[0]?.data?.reduce(
          (a: any, b: any) => a + b,
          0
        );
        ctx.save();
        const needleValue = data.datasets[0]?.needleValue;
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;
        const cx = (chartArea.right - chartArea.left) / 2;

        const cy = chartArea.bottom - chartArea.top;

        ctx.translate(cx, cy-10);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(cy - ctx.canvas.offsetTop-10, 0);
        ctx.lineTo(0, 3);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy-10, 5, 0, 10);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();

      }
    },
  };

  data: any = {
    datasets: [
      {
        data: [100 / 3, 100 / 3, 100 / 3],
        backgroundColor: ['red', 'yellow', 'green'],
        borderWidth: 1,
        needleValue: 25,
      },
    ],
  };
  ngAfterViewInit() {
    console.log('create');
    Chart.register(this.gauge);
    const chart = new Chart(this.myChart?.nativeElement, {
      type: 'doughnut',
      data: this.data,
      options: {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: false,
        circumference: -180,
        rotation: 270,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }
}
