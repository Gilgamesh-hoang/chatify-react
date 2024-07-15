import { isFacebookURL, isInstagramURL, isLinkedInURL, isValidURL, isYoutubeURL, } from '~/utils/linkUtil';

import { FacebookEmbed, InstagramEmbed, LinkedInEmbed, XEmbed, YouTubeEmbed, } from 'react-social-media-embed';
import Embed from 'react-embed';
import React from 'react';

const MessageEmbedItem = (
  { url, width, height }: { url:string, width:string|number, height:string|number}) => {
  if (!isValidURL(url)) return (<></>);

  //Facebook, Instagram, LinkedIn, Pinterest, TikTok, X (Twitter), and YouTube in React.
  const isFacebook = isFacebookURL(url);
  const isInstagram = isInstagramURL(url);
  const isLinkedIn = isLinkedInURL(url);
  const isTwitter = false;
  const isYouTube = isYoutubeURL(url);
  return (
    <>
      {isFacebook && <FacebookEmbed url={url} width={width} height={height} /> }
      {isInstagram && <InstagramEmbed url={url} width={width}  /> }
      {isLinkedIn && <LinkedInEmbed url={url} width={width} height={height} /> }
      {isTwitter && <XEmbed url={url} width={width} height={height} /> }
      {isYouTube && <YouTubeEmbed url={url} width={width} height={height} youTubeProps={
        {
          onReady: event => event.target.pauseVideo(),
          onError: event => console.log(event.data),
        }} /> }
      {!isFacebook && !isInstagram && !isLinkedIn && !isTwitter && !isYouTube && <Embed url={url} key={url} /> }
    </>
  );
};
export default MessageEmbedItem;