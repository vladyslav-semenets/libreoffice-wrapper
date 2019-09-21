import { Injectable } from '@nestjs/common';

import * as del from 'del';

import { writeFile, stat, readFile } from 'fs';
import { spawn } from 'child_process';
import { parse } from 'path';

@Injectable()
export class ConvertService {
  public async process(
    file: string,
    filename: string,
    convertTo: string,
  ): Promise<any> {

    await this.saveFile(file, filename);

    return new Promise((resolve, reject) => {
        let error = '';

        const child = spawn(
          process.env.LIBREOFFICE_BINARY_PATH,
            [
                '--headless',
                '--invisible',
                '--nofirststartwizard',
                '--nolockcheck',
                '--nologo',
                '--norestore',
                '--convert-to',
                convertTo,
                '--outdir',
                '.',
                `${filename}`,
            ],
            { cwd: '/tmp' },
        );

        child.stdout.on('data', (data) => {
            error += data;
        });

        child.stderr.on('data', (data) => {
            error += data;
        });

        child.on('close', (code) => {
            if (code === 0) {
                const filePath = `/tmp/${ConvertService.replaceFileExtension(filename, convertTo)}`;

                stat(filePath, (existsError) => {
                  if (existsError) {
                    reject(existsError);
                  } else {
                    readFile(filePath, (readFileError, data) => {
                      if (readFileError) {
                        reject(readFileError);
                      } else {
                        del.sync([`/tmp/${filename}`, filePath], { force: true });

                        resolve({
                          output: error,
                          filename: ConvertService.replaceFileExtension(filename, convertTo),
                          file: Buffer.from(data).toString('base64'),
                        });
                      }
                    });
                  }
              });
            } else {
                reject(error);
            }
        });
    });
  }

  public static replaceFileExtension(filename, newFileExtension) {
    const { name } = parse(filename);

    return `${name}.${newFileExtension}`;
  }

  protected saveFile(file, filename) {
    return new Promise((resolve, reject) => {
      writeFile(`/tmp/${filename}`, Buffer.from(file, 'base64'), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
