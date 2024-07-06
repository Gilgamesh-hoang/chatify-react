import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Avatar from '~/component/Avatar';
import { UserSideBar } from './SearchUser';

const UserSearchCard = ({
                          user,
                          onClose,
                        }: {
  user: UserSideBar;
  onClose: () => void;
}) => {
  return (
    <Link
      to={'/' + user.type + '/' + user.name}
      onClick={onClose}
      className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer"
    >
      <div>
        <Avatar type={user.type} width={40} height={40} name={user.name} />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">
          {user.type == 0 ? 'User' : 'Group'}
        </p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
