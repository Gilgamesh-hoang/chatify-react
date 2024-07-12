import React from 'react';
import Avatar from '~/component/Avatar';
import Tippy, { useSingleton } from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';

interface HeaderProps {
  type: 0 | 1,
  name: string,
  owner?: string,
  members?: string[],
}

const MessageHeader: React.FC<HeaderProps> = (props) => {
  const maxMemberShow = 3;
  let roomMembers: string[] = [];
  if (props.members) roomMembers = props.members.slice(0, maxMemberShow);
  if (props.owner) roomMembers.unshift(props.owner);

  const [source, target] = useSingleton({
    // overrides: ['placement', 'interactive', 'delay', 'animation', 'theme']
  });
  const renderAvatar = (name: string, owner: boolean) => {
    return (
      <Tippy singleton={target} content={<>{name}</>}>
        <div>
          <Avatar type={0} name={name} width={50} height={50} owner={owner} />
        </div>
      </Tippy>
    );
  };

  return (
    <div className="mt-auto mx-auto bg-white flex flex-col p-3 rounded-md justify-center items-center gap-1">
      <Tippy singleton={source} placement="top" interactive={true}
             delay={[100, 100]} animation='shift-away' theme='translucent' />
      <div className="flex gap-2">
        {
          props.type === 1 &&
          (<>
            {roomMembers.map((member) => renderAvatar(member, member === props.owner))}
            {props.members && props.members.length > maxMemberShow &&
              (
                <Tippy singleton={target} content={props.members.slice(maxMemberShow)}>
                  <div
                    className="overflow-hidden rounded-full flex justify-center items-center text-lg bg-slate-100 w-[50px] h-[50px]">
                    +{props.members.length - maxMemberShow}
                  </div>
                </Tippy>
              )
            }
          </>)
        }
        {
          props.type === 0 && renderAvatar(props.name, false)
        }
      </div>
      <div>{props.type === 1 ? 'Room: ' : ''}{props.name}</div>
      <div>This is the start of the conversation.</div>
    </div>
  );
};

export default React.memo(MessageHeader);