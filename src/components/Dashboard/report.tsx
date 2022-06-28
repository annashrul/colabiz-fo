import React from 'react';
import { Card, CardBody } from '@windmill/react-ui'
import { iTransaksi } from 'lib/interface';
import Link from 'next/link'
import Mutasi from 'components/transaksi/mutasi_row'

interface iCards {
    dataReport:Array<iTransaksi>;
    title:string;
    show:boolean;
}
const Report: React.FC<iCards> = ({dataReport,title,show}) => {

  return (
        <Card className="w-full mt-4 min-h-0">
            <CardBody>
            <div className="flex  justify-between">
                    <p className="mb-4 font-semibold text-gray-700 dark:text-gray-200">{title}</p>
                    {
                        show?
                            <Link href={'/transaksi'}>
                                <p className="mb-4 font-semibold text-gray-700 dark:text-gray-200">
                                    <button className="text-xs underline text-blue-700 dark:text-blue-200">Lihat Selengkapnya</button>
                                </p>
                            </Link>:""
                    }
                   
                </div>
                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                    <div className="w-full overflow-x-auto  overflow-y-auto  p-5" style={{maxHeight:'600px'}}>
                    {
                        dataReport?.length>0?dataReport.map((item:iTransaksi,i:number)=>{
                            return <Mutasi
                                        key={i}
                                        kd_trx={item.kd_trx}
                                        note={item.note}
                                        created_at={item.created_at}
                                        trx_in={item.trx_in}
                                        trx_out={item.trx_out}
                                    />
                        }): <div className="m-2 pb-2 text-gray-700 dark:text-gray-400 text-center">Tidak ada data.</div>
                    }
                    </div>
                    
                </div>
                
                
            </CardBody>
        </Card>
  );
};




export default Report;
