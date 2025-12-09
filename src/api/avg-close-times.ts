import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

// Want 500 datapoints with high priority and solved (so we know how long they took to solve) for avg time calcs
const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500&priority=high&status=solved';

// Choose to return in <days>d <hours>h <mins>m <secs>s
export const GET = async (req: Request, res: Response) => {
    const samples = 500 // fixed
    const { data } = await axios.get<SampleData>(DATA_URL);
    const reducedData = data.results.map(result => [result.created, result.updated]);
    
    let workingAvgSumInSecs = 0;
    for (let i = 0; i < reducedData.length; i++) {
        const start = new Date(reducedData[i][0]);
        const end = new Date(reducedData[i][1]);
        const timeTaken = end.getTime() - start.getTime(); // getTime() returns time in ms since epoch
        workingAvgSumInSecs += Math.floor(timeTaken / 1000); // ignore extra ms, unnecessary precision
    }

    const avgInSecs = Math.floor(workingAvgSumInSecs / samples); // ignore extra ms, unnecessary precision
    const days = Math.floor(avgInSecs / (24 * 60 * 60));
    const hours = Math.floor((avgInSecs % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((avgInSecs % (60 * 60)) / 60);
    const secs = avgInSecs % 60;

    const avg = {
        "average_time_taken": `${days}d ${hours}h ${mins}m ${secs}s`
    }

    res.json(avg);
};