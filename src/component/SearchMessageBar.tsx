import React, { ChangeEvent, useEffect, useRef } from 'react';
import { IoChevronDown, IoChevronUp, IoClose, IoSearch } from 'react-icons/io5';
import languageUtil from '~/utils/languageUtil';
import { isCloudinaryURL, isValidURL } from '~/utils/linkUtil';
import { ChatInfo } from '~/redux/chatDataSlice';

interface SearchBarProps {
  searchState: boolean;
  chatInfo: ChatInfo | undefined;
  searchResult: number[];
  searchFocus: React.RefObject<HTMLDivElement>;
  searchInput: React.MutableRefObject<string>;
  searchCursor: number;
  setSearchState: (state: boolean) => void;
  setSearchResult: (result: number[]) => void;
  setSearchCursor: (cursor: number) => void;
}

const SearchMessageBar: React.FC<SearchBarProps> = ({
                                               searchState,
                                               searchFocus,
                                               searchInput,
                                               chatInfo,
                                               setSearchState,
                                               setSearchResult,
                                               searchResult,
                                               searchCursor,
                                               setSearchCursor,
                                             }) => {
  const searchResetBtn = useRef<HTMLButtonElement>(null);

  const filterSearch = (queryString: string, keepCursor: boolean) => {
    if (!chatInfo) return;
    if (!chatInfo.messages) return;
    // create a founded array contains INDEXES of messages
    const founded: number[] = [];
    // if query string exists...
    if (queryString.length > 0)
      // find indexes of messages that are url but not Cloudinary URL or just plain text
      chatInfo.messages.forEach((message, index) => {
        const trueMessage = languageUtil.base64ToUtf8(message.mes);
        if (!isCloudinaryURL(trueMessage) || !isValidURL(trueMessage))
          if (
            languageUtil
              .base64ToUtf8(message.mes)
              .match(new RegExp(`(${queryString})`, 'gi')) != null
          )
            founded.push(index);
      });
    // update the search results with those indexes AND search cursor
    setSearchResult(founded);
    // keep cursor to not reset back to 1st search result
    if (!keepCursor) setSearchCursor(founded.length > 0 ? 0 : -1);
    // set the search query string
    searchInput.current = queryString;
  };

  useEffect(() => {
    if (searchFocus.current)
      searchFocus.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  }, [searchState, searchCursor]);

  useEffect(() => {
    filterSearch(searchInput.current, true);
  }, [chatInfo?.messages]);

  const handleSearchSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    // get the input from the form then filter search it
    const inputData = (evt.currentTarget.elements[0] as HTMLInputElement).value;
    filterSearch(inputData, false);
  };

  const handleResetVisible = (evt: ChangeEvent<HTMLInputElement>) => {
    const hasText = evt.currentTarget.value.trim().length === 0;
    if (searchResetBtn.current) searchResetBtn.current.hidden = hasText;
  };

  return (
    <div className="h-12 bg-white flex px-4 gap-2 items-center">
      {/*search input*/}
      <form
        className="h-full grow flex gap-2 items-center "
        onSubmit={handleSearchSubmit}
        onReset={() => {
          if (searchResetBtn.current)
            searchResetBtn.current.hidden = true;
        }}
      >
        <input
          type="text"
          placeholder="Search here..."
          className="py-1 px-4 outline-none w-full h-fit rounded-[6px] border-gray-300"
          onChange={handleResetVisible}
        />
        <button type="reset" ref={searchResetBtn} hidden>
          <IoClose size={20} className="text-secondary" />
        </button>
        <button
          type="submit"
          className="text-primary hover:text-secondary"
        >
          <IoSearch size={24} />
        </button>
      </form>
      {/*Result tracker*/}
      <span className="h-fit text-sm">
              {searchResult.length > 0
                ? `${searchCursor + 1} of ${searchResult.length} message${
                  searchResult.length > 1 ? 's' : ''
                }`
                : 'No message founded'}
            </span>

      {/*Next founded message*/}
      <button
        disabled={searchCursor >= searchResult.length - 1}
        className="disabled:text-gray-400"
        onClick={() => setSearchCursor(searchCursor + 1)}
        title="Next founded message"
      >
        <IoChevronUp size={24} />
      </button>

      {/*Prev founded message*/}
      <button
        disabled={searchCursor <= 0}
        className="disabled:text-gray-400"
        onClick={() => setSearchCursor(searchCursor - 1)}
        title="Previous founded message"
      >
        <IoChevronDown size={24} />
      </button>

      {/*Close button*/}
      <button>
        <IoClose size={24} onClick={() => setSearchState(false)} />
      </button>
    </div>
  );
};

export default SearchMessageBar;