export interface Service {
  id: number,
  sigle: string,
  designation: string,
  secretariat: boolean,
  service: Service
  departement: Service
  estDepartement: boolean,
}
