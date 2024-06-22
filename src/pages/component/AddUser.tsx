import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import Loading from './Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import { LuUserPlus2 } from 'react-icons/lu';
const AddUser = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [addName, setAddName] = useState('');
  const handleSearchUser = async () => {};
  useEffect(() => {
    handleSearchUser();
  }, [addName]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/**input search user */}
        <div className="bg-white rounded h-14 overflow-hidden flex ">
          <input
            type="text"
            placeholder="Enter user or group, you wanna add or"
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setAddName(e.target.value)}
            value={addName}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            {!loading && <LuUserPlus2 size={25} />}
            {loading && (
              <p>
                <Loading />
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default AddUser;
