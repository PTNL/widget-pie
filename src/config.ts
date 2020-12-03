import {
    EDataBlockType,
    EDataQueryMethod,
    EDatasetColumnType,
    EWidgetConfigViewOptionsType,
    EDataQueryFunction,
} from 'ptnl-constructor-sdk/enums';
import { IWidgetConfig } from 'ptnl-constructor-sdk/interfaces';
import { filterBlock, sortBlock } from 'ptnl-constructor-sdk/config-blocks';
import { EBlockKey, EViewOption } from './enum';

const pointerSylte = [
    ['circle', 'Круг', 'Circle'],
    ['triangle', 'Треугольник', 'Triangle'],
    ['rect', 'Прямоугольник', 'rect'],
    ['rectRounded', 'Прямоугольник с закругленными углами', 'Rect rounded'],
    ['rectRot', 'Ромб', 'Rect rot'],
    ['cross', 'Плюс', 'Cross'],
    ['crossRot', 'Крест', 'Cross rot'],
    ['star', 'Звезда', 'Star'],
    ['line', 'Линия', 'Line'],
    ['dash', 'Тире', 'Dash'],
];

export const config: IWidgetConfig = {
    label: {
        ru: 'Круговая диаграмма',
        en: 'Pie chart',
    },
    icon: 'assets/icon.svg',
    dataOptions: [
        {
            method: EDataQueryMethod.Aggregate,
            blocks: [
                {
                    type: EDataBlockType.Column,
                    key: EBlockKey.X,
                    dataType: EDatasetColumnType.Dimension,
                    function: EDataQueryFunction.Group,
                    label: {
                        ru: 'X',
                        en: 'X',
                    },
                    max: 1,
                },
                {
                    type: EDataBlockType.Column,
                    key: EBlockKey.Y,
                    dataType: EDatasetColumnType.Fact,
                    function: EDataQueryFunction.Sum,
                    label: {
                        ru: 'Y',
                        en: 'Y',
                    },
                    max: 4,
                },
                ...filterBlock,
                ...sortBlock,
            ],
        },
    ],
    viewOptions: [
        {
            type: EWidgetConfigViewOptionsType.Checkbox,
            key: EViewOption.DataLabels,
            label: {
                ru: 'Значение в графике',
                en: 'Value in the chart',
            },
            defaultValue: true,
        },
        {
            type: EWidgetConfigViewOptionsType.Checkbox,
            key: EViewOption.Legend,
            label: {
                ru: 'Легенда',
                en: 'Legend',
            },
            defaultValue: true,
        },
        {
            type: EWidgetConfigViewOptionsType.Splitter,
        },
        {
            type: EWidgetConfigViewOptionsType.Checkbox,
            key: EViewOption.Semicircle,
            label: {
                ru: 'Полукруг',
                en: 'Semicircle',
            },
            defaultValue: false,
        },
        {
            type: EWidgetConfigViewOptionsType.Checkbox,
            key: EViewOption.Doughnut,
            label: {
                ru: 'Донат',
                en: 'Doughnut',
            },
            defaultValue: false,
        },
    ],
};
