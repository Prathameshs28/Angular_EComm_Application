export interface CartProducts {
    price: number;
    _id: string;
    _org: {
      _id: string;
      name: string;
      email: string;
    };
    name: string;
    description: string;
    images: { public_id: string; url: string }[];
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    qty: any;
  }