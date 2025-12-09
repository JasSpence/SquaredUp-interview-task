import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

// Want same datapoints as avg-close-time
const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500&priority=high&status=solved';

function getResultsTimeInMS(result: SampleData["results"][0]) {
    const start = new Date(result.created);
    const end = new Date(result.updated);
    return end.getTime() - start.getTime(); // getTime() returns time in ms since epoch
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);
    const results = data.results;
    
    let longestTime = getResultsTimeInMS(results[0]);
    let longestTimeSample = results[0];

    for (let i = 0; i < results.length; i++) {
        let time = getResultsTimeInMS(results[i]);
        if (time > longestTime) {
            longestTime = time;
            longestTimeSample = results[i];
        }
    }

    const timeInSecs = Math.floor(longestTime / 1000); // ignore extra ms, unnecessary precision
    const days = Math.floor(timeInSecs / (24 * 60 * 60));
    const hours = Math.floor((timeInSecs % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((timeInSecs % (60 * 60)) / 60);
    const secs = timeInSecs % 60;

    const sample = {
        "time_taken": `${days}d ${hours}h ${mins}m ${secs}s`,
        "satisfaction-score": longestTimeSample.satisfaction_rating.score
    }

    res.json(sample);
};