export type CartItem = {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
};

const cartItems: CartItem[] = [
  {
    id: 'recB6qcHPxb62YJ75',
    title: 'Vancouver',
    singer: 'BIG Naughty (서동현)',
    price: '25000',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recdRxBsE14Rr2VuJ',
    title: 'Empty Island',
    singer: 'greenblue',
    price: '18000',
    img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recwTo120XST3PIoW',
    title: 'golden hour',
    singer: 'JVKE',
    price: '28000',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'rec1JZlfCIBOPdcT2',
    title: 'Home Sweet Home',
    singer: 'Gogang (고갱)',
    price: '20000',
    img: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recwTo160XST3PIoW',
    title: 'Lemon',
    singer: 'Kenshi Yonezu',
    price: '30000',
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recaBo120XST3PIoW',
    title: '돌멩이',
    singer: 'MASYTA (마시따)',
    price: '12000',
    img: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recqBo123XST3PIoK',
    title: 'L\'Amour, Les Baguettes, Paris',
    singer: '스텔라 장(Stella Jang)',
    price: '32000',
    img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recqBo133XST3PIoK',
    title: 'NO PAIN',
    singer: '실리카겔',
    price: '22000',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recqBo145XST3PIoK',
    title: '너에게 (feat. HYUN SEO)',
    singer: 'Halsoon',
    price: '20000',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'recqBo129XST3PIoK',
    title: '널 떠올리는 중이야(Think About You)',
    singer: 'PATEKO (파테코)',
    price: '25000',
    img: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'rdaqBo129XST3PIoK',
    title: '끝나지 않은 얘기',
    singer: '릴러말즈 & TOIL',
    price: '23000',
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    amount: 1,
  },
  {
    id: 'rdaqBo149XQT3PIoK',
    title: '각자의 밤',
    singer: '나상현씨 밴드',
    price: '21000',
    img: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=200&fit=crop',
    amount: 1,
  },
];

export default cartItems;
