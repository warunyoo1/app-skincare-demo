export type Product = {
  id: string;
  name: string;
  brand: string;
  variant: string;
  image: string;
  openImage: string;
  color: string;
  sourceUrl: string;
  price: number | null;
  stock: number | null;
};
// Two pictured colour variants; photography alone is not an inventory or a price list.
export const products: Product[] = [
  {
    id: "queens-balm-blue",
    name: "Queen’s Balm",
    brand: "POUCH24",
    variant: "Midnight blue",
    image: "/assets/balm-blue.webp",
    openImage: "/assets/balm-blue-open.webp",
    color: "#123c91",
    sourceUrl:
      "https://drive.google.com/file/d/15uMpfw9QwM_hPzP5FltFvOyreepnHfJu/view",
    price: null,
    stock: null,
  },
  {
    id: "queens-balm-ivory",
    name: "Queen’s Balm",
    brand: "POUCH24",
    variant: "Soft ivory",
    image: "/assets/balm-ivory.webp",
    openImage: "/assets/balm-ivory-open.webp",
    color: "#eeede7",
    sourceUrl:
      "https://drive.google.com/file/d/1-WEOZHcvct7LmaxILX5qU4AIj2NRRN-2/view",
    price: null,
    stock: null,
  },
];
export const gallery = [
  {
    src: "/assets/editorial.webp",
    alt: "POUCH24 Queen’s Balm สีน้ำเงินกับกล่องผลิตภัณฑ์",
  },
  { src: "/assets/ritual.webp", alt: "ภาพสาธิตการใช้บาล์มจากโฟลเดอร์แบรนด์" },
  {
    src: "/assets/texture.webp",
    alt: "เนื้อผลิตภัณฑ์สีเหลืองอ่อนจากภาพต้นฉบับ",
  },
  { src: "/assets/water.webp", alt: "บาล์มสีน้ำเงินท่ามกลางแสงและหยดน้ำ" },
];
