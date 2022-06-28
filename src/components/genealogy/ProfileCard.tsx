// import { iProfiles } from 'lib/interface';
import { iNetwork } from 'lib/interface';
import moment from 'moment';
import React from 'react';
import { useToasts } from 'react-toast-notifications';
// import ProfileList from './ProfileList';
interface iProfileCard {
  id: string;
  name: string;
  picture: string;
  hasChild: boolean;
  join_date: string;
  res: Array<iNetwork>;
  callBack:(pin:string)=>void;
}
const ProfileCard: React.FC<iProfileCard> = ({ id, name, picture,  res = [], callBack }) => {
  const { addToast } = useToasts();
  const handleMore=(idData:string)=>{
    if((idData)===null)addToast("id tidak ditemukan!", {appearance: 'error',autoDismiss: true,})
    else{
       callBack(idData);
    }
        // addToast(idData, {appearance: 'warning',autoDismiss: true});
}
  return (
    <div className="text-center">
      <div className="flex flex-col justify-center items-center">
        <div className="w-16">
          <img
            className="block rounded-full m-auto shadow-md"
            alt={name}
            src={picture}
            onError={(e)=>{onerror = null; e.currentTarget.src="https://dummyimage.com/302x302/94a3b8/ffffff"}}
          />
        </div>
        <div className="text-gray-600">
          <p className="text-white font-semibold">{name}</p>
          <p><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-800 my-1 bg-old-gold-500 last:mr-0 mr-1">
            {id}
            </span>
          </p>
          {res.length <= 0 && 
          <button
            className="inline-flex items-center justify-center w-7 h-7 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800"
            onClick={(event)=>{event.preventDefault();handleMore(String(id));}}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" fillRule="evenodd"></path></svg>
          </button>
          }
        </div>
      </div>
      {res.length > 0  && 
        // <ProfileList data={res} />
        <ul className="flex flex-row mt-10 justify-center">
      {/* <PseudoBorder mTop="-mt-10" /> */}
      <div className="-mt-10 border-l-2 absolute h-10 border-gray-400" />
        {res.map((datum, idX) => {
          const len = res.length;
          return (
            <li key={idX} className="relative p-6">
              <div
                style={{
                  left: idX === 0 ? "50%" : 0,
                  right: idX === len - 1 ? "50%" : 0
                }}
                className="border-t-2 absolute h-8 border-gray-400 top-0"
              />
              <div className="relative flex justify-center">
                {/* <PseudoBorder mTop="-mt-6" /> */}
                <div className="-mt-6 border-l-2 absolute h-6 border-gray-400 top-0" />
                <ProfileCard
                key={idX}
                {...datum}
                id={datum.id}
                name={datum.name}
                picture={datum.picture}
                hasChild={datum.hasChild}
                join_date={moment(datum.join_date).format('YYYY-MM-DD')}
                res={JSON.parse(JSON.stringify(datum.children))}
                callBack={(val)=>handleMore(val)}
                // {...res}
                />
              </div>
            </li>
          );
        })}
      </ul>
      }
    </div>
  );
};
export default ProfileCard;
