import React from 'react';
import { Card, CardBody } from '@windmill/react-ui'

interface iStatistic {
    jumlah:number;
}
const Statistic: React.FC<iStatistic> = ({jumlah}) => {

  return (
        <Card className="w-full mt-8 min-h-0">
            <CardBody>
                <div className="p-4 flex flex-col items-center text-center m-auto">
                   
                    <div>
                        <p className="mb-2 text-lg font-medium text-gray-600 dark:text-gray-400">Total Member yang telah bergabung :</p>
                        <div className="flex flex-col items-center">
                            <p className="font-semibold text-gray-700 dark:text-gray-200 flex">
                                <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6 mt-1" ><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg> 
                                <span className='ml-3 text-2xl'>{jumlah}</span>
                            </p>
                        </div>
                    </div>

                </div>
                
            </CardBody>
        </Card>
  );
};




export default Statistic;
