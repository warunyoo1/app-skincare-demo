import { useState } from "react";
import { Bookmark, Check, ArrowUpRight } from "lucide-react";
import { Dialog } from "../../../shared/ui/Dialog";
import { products } from "../data/catalog";
import type { Product } from "../data/catalog";
export function ProductDialog({
  product,
  onSelect,
  saved,
  onSave,
  onClose,
}: {
  product: Product;
  onSelect: (id: string) => void;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <Dialog
      title={product.name + " " + product.variant}
      onClose={onClose}
      className="product-dialog"
    >
      <div className="product-picture">
        <img
          src={opened ? product.openImage : product.image}
          alt={product.name + " บรรจุภัณฑ์ " + product.variant}
        />
        <div className="photo-switch" role="group" aria-label="มุมมองสินค้า">
          <button aria-pressed={!opened} onClick={() => setOpened(false)}>
            บรรจุภัณฑ์
          </button>
          <button aria-pressed={opened} onClick={() => setOpened(true)}>
            เปิดฝา
          </button>
        </div>
      </div>
      <div className="product-copy">
        <span className="brand-label">{product.brand}</span>
        <h2>{product.name}</h2>
        <p className="product-lead">A little ritual, just for you.</p>
        <div className="product-divider" />
        <p className="variant-label">แบบบรรจุภัณฑ์</p>
        <div className="variant-options">
          {products.map((p) => (
            <button
              key={p.id}
              aria-pressed={p.id === product.id}
              onClick={() => {
                setOpened(false);
                onSelect(p.id);
              }}
            >
              <span style={{ background: p.color }} />
              {p.variant}
            </button>
          ))}
        </div>
        <dl className="product-facts">
          <div>
            <dt>ราคา</dt>
            <dd>รอยืนยันข้อมูล</dd>
          </div>
          <div>
            <dt>รายละเอียดและขนาด</dt>
            <dd>จะอัปเดตเพิ่มเติม</dd>
          </div>
        </dl>
        <button
          className={"button primary save-product " + (saved ? "is-saved" : "")}
          onClick={onSave}
        >
          {saved ? <Check size={17} /> : <Bookmark size={17} />}{" "}
          {saved ? "เก็บไว้แล้ว · กดเพื่อนำออก" : "เก็บไว้ดูภายหลัง"}
        </button>
        <p className="product-note">รายการที่เก็บไว้ยังไม่ใช่คำสั่งซื้อ</p>
        <a
          className="source-link"
          href={product.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          ภาพต้นฉบับจากแบรนด์ <ArrowUpRight size={13} />
        </a>
      </div>
    </Dialog>
  );
}
