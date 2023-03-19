import { type } from "os";

type Shop = {
  id: string;
  name: string;
  address: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
  location: {
    type: string;
    coordinates: number[];
  }
  row: string;
}

type Row = {
  id: string;
  status: string;
  customers: Customer[];
  date : Date;
  shop: Shop;
}

type User = {
  email: string;
  name: string;
  role: string;
  id: string;
}

type Customer = {
  date: Date;
  user: User;
}

export { Shop, Row }