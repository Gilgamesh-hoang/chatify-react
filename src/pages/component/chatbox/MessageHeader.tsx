import React from 'react';
import Avatar from '~/component/Avatar';

interface HeaderProps {
  type: 0 | 1,
  name: string,
  owner?: string,
  members?: string[],
}

const MessageHeader: React.FC<HeaderProps> = (props) => {
  let roomMembers: string[] = [];
  if (props.members) roomMembers = props.members.concat();
  if (props.owner) roomMembers.unshift(props.owner);

  return (
    <div className="mt-auto mx-auto bg-white flex flex-col p-3 rounded-md justify-center items-center gap-1">
      <div className="flex gap-2">
        {
          props.type === 1 ?
            roomMembers.map((member) =>
              <Avatar type={0} name={member} width={50} height={50} owner={member === props.owner}></Avatar>) :
            <Avatar type={0} name={props.name} width={50} height={50}></Avatar>
        }
      </div>
      <div>{props.type === 1 ? "Room: " : ""}{props.name}</div>
      <div>This is the start of the conversation.</div>
    </div>
  );
};

export default React.memo(MessageHeader);