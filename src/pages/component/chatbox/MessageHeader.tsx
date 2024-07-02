import React from 'react';
import Avatar from '~/component/Avatar';

interface HeaderProps {
  type: 0 | 1,
  name: string,
  owner?: string,
  members?: string[],
}

const MessageHeader: React.FC<HeaderProps> = (props) => {
  return (
    <div className="mt-auto mx-auto bg-white flex flex-col p-3 rounded-md justify-center items-center">
      <div className="flex gap-2">
        {
          props.owner && <Avatar type={0} name={props.owner} width={50} height={50} owner={true} />
        }
        {
        props.members?.map((member) => <Avatar type={0} name={member} width={50}
                                                                          height={50}></Avatar>)
        }
      </div>
      <div>This is the start of the conversation.</div>
    </div>
  );
};

export default React.memo(MessageHeader);