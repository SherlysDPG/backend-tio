import { Response, Request, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const cleanUpFiles = (req: Request, res: Response, next: NextFunction) => {
  const publicDir = path.resolve('public');

  const excludePaths = [
    path.resolve('public', 'uploads', 'noDelete'),
    path.resolve('public', 'data', 'ProductMaster.xlsx'),
  ];

  // Función recursiva que devuelve true si la carpeta está vacía después de limpiar
  function deleteFilesRecursively(dir: string): boolean {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let isEmpty = true;

    for (const entry of entries) {
      const fullPath = path.resolve(dir, entry.name);

      // Ignorar si está en la lista de exclusión
      if (
        excludePaths.some(
          (p) => fullPath === p || fullPath.startsWith(p + path.sep)
        )
      ) {
        isEmpty = false; // Si contiene algo excluido, no está vacía
        continue;
      }

      if (entry.isDirectory()) {
        const dirEmpty = deleteFilesRecursively(fullPath);
        if (dirEmpty) {
          fs.rmdirSync(fullPath);
        } else {
          isEmpty = false;
        }
      } else if (entry.isFile()) {
        fs.unlinkSync(fullPath);
      }
    }

    return isEmpty && entries.length > 0 ? true : false;
  }

  deleteFilesRecursively(publicDir);

  next();
};

export { cleanUpFiles };
