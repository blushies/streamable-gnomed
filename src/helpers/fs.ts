import fs from 'fs';
import { promisify } from 'util';


const fsAccess = promisify(fs.access);

export const fileExists = async (filename: string): Promise<boolean> => {
  try {
    await fsAccess(filename, fs.constants.F_OK);
    return true;
  }
  catch (err) {
    return false;
  }
};
