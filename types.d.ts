type Shop = {
    id: number;
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
    customers: any[];
    date : Date;
    shop: Shop;
  }

  export { Shop, Row }