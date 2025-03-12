import { db } from 'src/common/config/db.config';
import { core } from 'src/common/config/core.config';
import { auth } from './auth.config';

export default () => ({
  db,
  core,
  auth,
});
