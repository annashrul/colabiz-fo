import React from 'react';

interface iBank {
  style?: string;
  handleClick: (id:string) => void;
  title:string,
  acc_no:string;
  acc_name:string;
  logo:string;
  id:string;
  selected: Boolean;
}
const Bank: React.FC<iBank> = ({selected,handleClick,title,acc_no,acc_name,logo,id}) => {
  return (
        <button
          onClick={(event)=>{event.preventDefault();handleClick(id)}}
          className={"relative  block mb-5 p-px overflow-hidden rounded shadow-sm hover:scale-105 group hover:shadow-xl focus:outline-none "+(selected?"w-full border-4 border-old-gold":"w-full border-4 border-gray-400")}
        >
          <div className="relative flex items-start p-5 pb-8 bg-white dark:bg-gray-700 dark:hover:bg-gray-800 rounded-sm">
            <div className="mr-2 lg:mr-4 w-1/3 h-10">
              <img src={logo} className="w-full h-20 object-contain	"/>
            </div>
            <div className="lg:pr-4 w-2/3 text-left">
              <h6 className="mb-2 font-semibold leading-5  text-gray-600 dark:text-gray-400">
                {title}
              </h6>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {acc_no}<br/>
                {acc_name}
              </p>
            </div>
            <div className="ml-10 mt-9">
              <svg
                className="w-3 text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-deep-purple-accent-400"
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
              </svg>
            </div>
          </div>
        </button>
    )
};
export default Bank;
