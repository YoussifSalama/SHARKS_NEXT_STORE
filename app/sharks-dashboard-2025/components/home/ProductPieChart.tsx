"use client"
import { ResponsivePie } from '@nivo/pie'

const data = [
    {
        "id": "Views",
        "label": "Views",
        "value": 492,
        "color": "hsl(308, 70%, 50%)"
    },
    {
        "id": "Clicks",
        "label": "Clicks",
        "value": 393,
        "color": "hsl(285, 70%, 50%)"
    },
    {
        "id": "make",
        "label": "make",
        "value": 137,
        "color": "hsl(345, 70%, 50%)"
    },
    {
        "id": "javascript",
        "label": "javascript",
        "value": 165,
        "color": "hsl(8, 70%, 50%)"
    },
    {
        "id": "php",
        "label": "php",
        "value": 19,
        "color": "hsl(343, 70%, 50%)"
    }
];

const ProductPieChart = () => {
    return (<ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                symbolShape: 'circle'
            }
        ]}
    />)
}
export default ProductPieChart;