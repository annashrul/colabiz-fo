import React from 'react';
import Card from '../Common/Widget'
interface iCards {
  c1: string;
  c2: string;
  c3: string;
  c4: string;
}
const Cards: React.FC<iCards> = ({ c1,c2,c3,c4 }) => {
  return (
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <div
            className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
          >
            <Card
              color="orange"
              icon="money"
              title="Saldo Utama"
              value={c1}
            />  
          </div>
          <div
            className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
          >
            <Card
              color="orange"
              icon="google-wallet"
              title="Tiket Aktivasi"
              value={c2}
            />  
          </div>
          <div
            className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
          >
            <Card
              color="orange"
              icon="bank"
              title="Total Modal"
              value={c3}
            />  
          </div>
          <div
            className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
          >
            <Card
              color="orange"
              icon="coffee"
              title="Referral Anda"
              value={c4}
            />  
          </div>
        </div>
  );
};
export default Cards;
