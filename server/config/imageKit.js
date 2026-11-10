import {ImageKit,toFile} from '@imagekit/nodejs';

export const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "", 
});


export {toFile};