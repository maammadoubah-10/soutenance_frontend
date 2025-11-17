export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // page courante
  size: number;
}
