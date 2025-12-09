import { Parameter, SampleData } from './types';

 export function getPercents(data: SampleData, paramInfo: Parameter) {
    const parameter = paramInfo.parameter
    const types = paramInfo.types;
    const reducedData = data.results.map(result => result[parameter]);
    const totalDatapoints = data.results.length;
    let percentages: { [key: string]: number } = {};
    for (let i = 0; i < types.length; i++) {
        let label = types[i].label;
        let categories = types[i].categories;
        percentages[label] = reducedData.filter(parameter => typeof parameter === 'string' && categories.includes(parameter)).length / totalDatapoints * 100;
    }
    return {
        "datapoints": totalDatapoints,
        "percentages": {
            percentages
        }
    };
}