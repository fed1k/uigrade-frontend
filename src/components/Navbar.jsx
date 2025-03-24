import React from 'react';

function Navbar() {
  return (
      <div className='max-w-[794px]  mx-auto h-[60px] bg-white mb-3  p-5 rounded-[100px] flex items-center gap-3'>
       <div className='w-8 h-8 bg-[#01A3FE] flex justify-center items-center rounded-full'>
         <span className='text-md'>💎</span>
       </div>
       <p className='text-[#121212] text-[16px] leading-6 font-semibold text-Inter'>UI GRADE</p>
    </div>

  );
}

export default Navbar;
