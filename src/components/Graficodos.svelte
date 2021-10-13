<script>
    import { scaleLinear } from "d3-scale";
    import { dataReport } from "../stores/ReporteStore";
    import { productoStore } from "../stores/ProductosStore";
    const points = [
        { year: 1990, birthrate: 20 },
        { year: 1995, birthrate: 14.6 },
        { year: 2000, birthrate: 14.4 },
        { year: 2005, birthrate: 14 },
        { year: 2010, birthrate: 13 },
        { year: 2015, birthrate: 12.4 },
    ];

    // $: console.log($dataReport);

    // let data = $dataReport.map((r) => {
    //     data = [...data, { year: r.codigo, birthrate: r.cantidadTotal }];
    // });
    // $: data;
    // $: console.log(data);
    // console.log("impresion", { obj });
    const xTicks = [1990, 1995, 2000, 2005, 2010, 2015];
    const yTicks = [
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 200,
        300, 400, 500,
    ];
    const padding = { top: 20, right: 15, bottom: 20, left: 25 };

    let width = 500;
    let height = 500;
    function formatMobile(tick) {
        return "'" + tick.toString().slice(-2);
    }

    $: xScale = scaleLinear()
        .domain([0, xTicks.length])
        .range([padding.left, width - padding.right]);

    $: yScale = scaleLinear()
        .domain([0, Math.max.apply(null, yTicks)])
        .range([height - padding.bottom, padding.top]);

    $: innerWidth = width - (padding.left + padding.right);
    $: barWidth = innerWidth / xTicks.length;
</script>

<h5>Stock</h5>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
    <svg>
        <!-- y axis -->
        <g class="axis y-axis">
            {#each $productoStore as tick}
                <g
                    class="tick tick-{tick.stock}"
                    transform="translate(0, {yScale(tick.stock)})"
                >
                    <line x2="100%" />
                    <text y="-4"
                        >{tick.stock}
                        {tick.stock === 20 ? " Buena ventas" : ""}</text
                    >
                </g>
            {/each}
        </g>

        <!-- x axis -->
        <g class="axis x-axis">
            {#each $productoStore as point, i}
                <g class="tick" transform="translate({xScale(i)},{height})">
                    <text x={barWidth / 2} y="-4"
                        >{width > 380
                            ? point.codigo
                            : formatMobile(point.codigo)}</text
                    >
                </g>
            {/each}
        </g>

        <g class="bars">
            {#each $productoStore as point, i}
                <rect
                    x={xScale(i) + 2}
                    y={yScale(point.stock)}
                    width={barWidth - 4}
                    height={yScale(0) - yScale(point.stock)}
                />
            {/each}
        </g>
    </svg>
</div>

<style>
    h2 {
        text-align: center;
    }

    .chart {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    svg {
        position: relative;
        width: 100%;
        height: 200px;
    }

    .tick {
        font-family: Helvetica, Arial;
        font-size: 0.725em;
        font-weight: 200;
    }

    .tick line {
        stroke: #e2e2e2;
        stroke-dasharray: 2;
    }

    .tick text {
        fill: #ccc;
        text-anchor: start;
    }

    .tick.tick-0 line {
        stroke-dasharray: 0;
    }

    .x-axis .tick text {
        text-anchor: middle;
    }

    .bars rect {
        fill: #a11;
        stroke: none;
        opacity: 0.65;
    }
</style>
