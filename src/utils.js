// lo creo aca para SACAR LAS RUTAS del server y para poder usarlo en c/ archivo donde lo preciso
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));