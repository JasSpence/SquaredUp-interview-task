import { QueryClient, QueryClientProvider } from "react-query"
import Data from "./Data"
import SortSelector from "./SortSelector"
import { useState } from 'react';

const queryClient = new QueryClient()

function App() {
    const [url, setUrl] = useState("/api/data");
    return (
        <QueryClientProvider client={queryClient}>
            <div className='p-4'>
                <h1 className='mb-4 text-3xl'>Data Display</h1>
                <SortSelector url={url} setUrl={setUrl} />
                <Data url={url} />
            </div>
        </QueryClientProvider>
    )
}

export default App
