import { Declare, Widget, OnChange } from 'ptnl-constructor-sdk';
import { DefaultDataOptionKey } from 'ptnl-constructor-sdk/constants';
import { EBlockKey, EViewOption } from './enum';

const rootElement = document.getElementById('root') as HTMLCanvasElement;
const ctx = rootElement.getContext('2d');

const CHART_CONFIG: Chart.ChartConfiguration = {
    data: {
        labels: [],
        datasets: [],
    },
};

const COLORS = [
    '#00AFD7',
    '#C724B1',
    '#10069F',
    '#FF9900',
    '#1857F0',
    '#FEDB00',
    '#78D64B',
    '#0C83E4',
    '#8A1F7A',
    '#E45D2B',
    '#F5C7D1',
    '#0E0F7D',
    '#ED6881',
    '#70B5EC',
    '#D76BC8',
    '#6F6CC3',
];

let chart = new window.Chart(ctx, CHART_CONFIG);
window.addEventListener('resize', function () {
    chart.resize();
});

@Declare()
export class Pie extends Widget implements OnChange {
    get columns() {
        return this.dataSettings[DefaultDataOptionKey].columnsByBlock;
    }

    onChange(): void {
        if (!this.columns[EBlockKey.X].length) {
            chart.update();
            this.ready();
            return;
        }

        CHART_CONFIG.data.datasets = this.getRows();

        CHART_CONFIG.data.labels = this.data[DefaultDataOptionKey].map(
            (item) => {
                return item[this.columns[EBlockKey.X][0].path];
            },
        );

        this.resetChart();
        this.ready();
    }

    private resetChart() {
        Object.assign(CHART_CONFIG.options, this.getConfigOptions());

        if (this.viewSettings[EViewOption.Doughnut]) {
            CHART_CONFIG.type = 'doughnut';
        } else {
            CHART_CONFIG.type = 'pie';
        }

        if (chart) {
            chart.destroy();
        }

        chart = new window.Chart(ctx, {
            type: CHART_CONFIG.type,
            data: CHART_CONFIG.data,
            options: {
                ...CHART_CONFIG.options,
            },
        });
    }

    private getConfigOptions(): Chart.ChartOptions {
        return {
            responsive: true,
            maintainAspectRatio: false,

            circumference: this.viewSettings[EViewOption.Semicircle]
                ? Math.PI
                : Math.PI * 2,
            rotation: this.viewSettings[EViewOption.Semicircle] ? -Math.PI : 0,

            layout: {
                padding: 10,
            },

            tooltips: {
                callbacks: {
                    beforeLabel(
                        tooltipItem: Chart.ChartTooltipItem,
                        data: Chart.ChartData,
                    ): string | string[] {
                        return data.datasets[tooltipItem.datasetIndex].label;
                    },
                },
            },

            plugins: {
                datalabels: {
                    display: this.viewSettings[EViewOption.DataLabels],
                    align: 'top',
                    color: '#ffffff',
                },
            },

            legend: {
                display: this.viewSettings[EViewOption.Legend],
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
        };
    }

    private getRows() {
        const rows = [];
        this.columns[EBlockKey.Y].forEach((column, index) => {
            rows.push(
                this.createDataset(
                    index,
                    column.name,
                    this.data[DefaultDataOptionKey].map(
                        (item) => item[column.path],
                    ),
                ),
            );
        });
        return rows;
    }

    private createDataset(index, label, data): Chart.ChartDataSets {
        const count = this.data[DefaultDataOptionKey].length;

        const alphaIndex = this.columns[EBlockKey.Y].length - index - 1;
        let opacity = 1 - (alphaIndex / 10) * 3;

        opacity = opacity < 0.39 ? 0.39 : opacity;

        const colors = Array.from(Array(count).keys()).map((item, index) =>
            this.getRGBAColor(COLORS[index % COLORS.length], opacity),
        );

        return {
            label,
            data,
            backgroundColor: colors,
        };
    }

    private getRGBAColor(hex, opacity = 1) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) {
            return hex;
        }
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    private hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }
}
