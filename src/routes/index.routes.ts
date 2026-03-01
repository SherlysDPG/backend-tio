import { Router } from 'express';
import { readdirSync } from 'fs';

const PATH_ROUTES = `${__dirname}`;
const router = Router();

const cleanFileName = (filename: string) => {
  const file = filename.split('.').shift();

  return file;
};

readdirSync(PATH_ROUTES).filter((filename) => {
  const cleanName = cleanFileName(filename);

  if (cleanName !== 'index') {
    import(`./${cleanName}.routes`).then((module) => {
      router.use(`/${cleanName}`, module.router);
    });
  }
});

export { router };
