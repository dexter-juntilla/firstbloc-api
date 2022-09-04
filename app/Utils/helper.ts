import bcrypt from 'bcryptjs';

/**
 * Custom hashing because I cant make adonisjs hashing work with docker
 * sad
 *
 * @param password
 * @returns hashed password
 */
export const hashPassword = async (
  password: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: Error, hash: any) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

/**
 * Custom bcrypt validation of password hash
 *
 * @param password
 * @param hash
 * @returns
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean | null> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err: Error, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
