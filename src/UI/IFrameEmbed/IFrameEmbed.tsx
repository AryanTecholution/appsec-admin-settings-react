import React, { useState } from 'react';

interface IFrameEmbedProps {
  url: string;
}

const IFrameEmbed: React.FC<IFrameEmbedProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        title="Embedded Content"
        style={{position: 'absolute', top: '86px', left:'0', height: '100%', width: '100%', border: 'none'}}
        src={url}
        frameBorder="0"
        allowFullScreen
        onLoad={handleLoad}
      ></iframe>
    </div>
  );
};

export default IFrameEmbed;
