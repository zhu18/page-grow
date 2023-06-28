import {EGrowType} from './rule'

export const defaultConfig = [
    {
        type: 1,
        name: "自定义",
        config: {
            growType: EGrowType.TopToBottom,
            interval: 0.03,
            bgType: "sys_opacity",
            stringType: "sys_stringWave",
            numberType: "sys_number",
            imageType: "sys_opacity",
            svgType: "sys_opacity",
            canvasType: "sys_opacity",
            videoType: "sys_opacity",
            chartType: "sys_opacity",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_opacity"
        }
    },
    {
        type: 2,
        name: "向下渐显",
        des: "上到下-opacity",
        growType: EGrowType.TopToBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_opacity",
            stringType: "sys_opacity",
            numberType: "sys_opacity",
            imageType: "sys_opacity",
            svgType: "sys_opacity",
            canvasType: "sys_opacity",
            videoType: "sys_opacity",
            chartType: "sys_opacity",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_opacity"
        }
    },
    {
        type: 3,
        name: "向下展开",
        des: "上到下-height",
        growType: EGrowType.TopToBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_height",
            stringType: "sys_height",
            numberType: "sys_height",
            imageType: "sys_height",
            svgType: "sys_height",
            canvasType: "sys_opacity",
            videoType: "sys_height",
            chartType: "sys_height",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_height"
        }
    },
    {
        type: 4,
        name: "向下放大",
        des: "上到下-scale",
        growType: EGrowType.TopToBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_scale",
            stringType: "sys_scale",
            numberType: "sys_scale",
            imageType: "sys_scale",
            svgType: "sys_scale",
            canvasType: "sys_scale",
            videoType: "sys_scale",
            chartType: "sys_scale",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_scale"
        }
    },
    {
        type: 5,
        name: "向右渐显",
        des: "左到右-opacity",
        growType: EGrowType.LeftToRight,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_opacity",
            stringType: "sys_opacity",
            numberType: "sys_opacity",
            imageType: "sys_opacity",
            svgType: "sys_opacity",
            canvasType: "sys_opacity",
            videoType: "sys_opacity",
            chartType: "sys_opacity",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_opacity"
        }
    },
    {
        type: 6,
        name: "向右展开",
        des: "左到右-width",
        growType: EGrowType.LeftToRight,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_width",
            stringType: "sys_width",
            numberType: "sys_width",
            imageType: "sys_width",
            svgType: "sys_width",
            canvasType: "sys_width",
            videoType: "sys_width",
            chartType: "sys_width",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_width"
        }
    },
    {
        type: 7,
        name: "向右放大",
        des: "左到右-scale",
        growType: EGrowType.LeftToRight,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_scale",
            stringType: "sys_scale",
            numberType: "sys_scale",
            imageType: "sys_scale",
            svgType: "sys_scale",
            canvasType: "sys_scale",
            videoType: "sys_scale",
            chartType: "sys_scale",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_scale"
        }
    },
    {
        type: 8,
        name: "向右下渐显",
        des: "左上到右下-opacity",
        growType: EGrowType.LeftTopToRightBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_opacity",
            stringType: "sys_opacity",
            numberType: "sys_opacity",
            imageType: "sys_opacity",
            svgType: "sys_opacity",
            canvasType: "sys_opacity",
            videoType: "sys_opacity",
            chartType: "sys_opacity",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_opacity"
        }
    },
    {
        type: 9,
        name: "向右下放大",
        des: "左上到右下-scale",
        growType: EGrowType.LeftTopToRightBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_scale",
            stringType: "sys_scale",
            numberType: "sys_scale",
            imageType: "sys_scale",
            svgType: "sys_scale",
            canvasType: "sys_scale",
            videoType: "sys_scale",
            chartType: "sys_scale",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_scale"
        }
    },
    {
        type: 10,
        name: "向右下横向展开",
        des: "左上到右下-width",
        growType: EGrowType.LeftTopToRightBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_width",
            stringType: "sys_width",
            numberType: "sys_width",
            imageType: "sys_width",
            svgType: "sys_width",
            canvasType: "sys_width",
            videoType: "sys_width",
            chartType: "sys_width",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_width"
        }
    },
    {
        type: 11,
        name: "向右下纵向展开",
        des: "左上到右下-height",
        growType: EGrowType.LeftTopToRightBottom,
        target: '',
        config: {
            interval: 0.03,
            bgType: "sys_height",
            stringType: "sys_height",
            numberType: "sys_height",
            imageType: "sys_height",
            svgType: "sys_height",
            canvasType: "sys_opacity",
            videoType: "sys_height",
            chartType: "sys_height",
            anovSimpleMode: false,
            parseLayer: 1,
            leafNodeType: "sys_height"
        }
    }
]