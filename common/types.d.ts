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

type NewShop = {
  id?: string
  email: string
  name: string
  description: string
  coords: [lat: number, lng: number]
  phone: string
  website: string
  address: string
  logo: string
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

type Role = 'customer'|'owner'

type Customer = {
  date: Date;
  user: User;
}

export { Shop, NewShop, Row, Role }