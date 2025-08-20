import { environment } from '../../../environments/environment';

const strip = (s: string) => s.replace(/\/+$/, '');
const stripLeading = (s: string) => s.replace(/^\/+/, '');

export const API_ROOT = strip(environment.hostmicroserviceutilisateur); // .../utilisateur

export const apiUrl = (path: string) => `${API_ROOT}/${stripLeading(path)}`;
