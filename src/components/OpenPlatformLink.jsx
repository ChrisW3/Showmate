import React from 'react';

function OpenPlatformLink({ link }) {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button onClick={() => openInNewTab(`${link}`)} className='border text-black bg-gray-300 border-gray-300 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base'>
      Where to Watch
    </button>
  );
}

export default OpenPlatformLink;