import React from 'react';
import { Box } from '@mui/material';

function UserImage({ image, size = '3' }) {
  const imageSize = {
    1: 'w-8',
    2: 'w-12',
    3: 'w-16',
  };

  const imageSrc = image || 'path_to_default_image_placeholder.png';

  return (
    <Box className={`rounded-full overflow-hidden ${imageSize[size]}`}>
      <img className="object-cover w-full h-full" alt="user" src={imageSrc} />
    </Box>
  );
}

export default UserImage;
