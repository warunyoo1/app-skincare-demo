import { lazy, Suspense, useCallback, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Map,
  Footprints,
  Bookmark,
  Flower2,
  LayoutGrid,
  Layers3,
  Camera,
  Home,
  RotateCcw,
  MousePointer2,
  Check,
  Info,
  Trash2,
} from "lucide-react";
import { products, gallery } from "../features/products/data/catalog";
import { ProductDialog } from "../features/products/components/ProductDialog";
import { destinations, START } from "../features/showroom/lib/navigation";
import type {
  Journey,
  Movement,
} from "../features/showroom/components/CameraRig";
import { Dialog } from "../shared/ui/Dialog";
const ShowroomScene = lazy(
  () => import("../features/showroom/components/ShowroomScene"),
);
type Panel = "gallery" | "saved" | "help" | null;
const directions = [
  { key: "forward", label: "เดินหน้า", Icon: ArrowUp },
  { key: "left", label: "เดินซ้าย", Icon: ArrowLeft },
  { key: "backward", label: "ถอยหลัง", Icon: ArrowDown },
  { key: "right", label: "เดินขวา", Icon: ArrowRight },
] as const;
export function App() {
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [hidden, setHidden] = useState(false);
  const [overview, setOverview] = useState(false);
  const [active, setActive] = useState<string>("entrance");
  const [journey, setJourney] = useState<Journey>({ key: 0, pose: START });
  const movement = useRef<Movement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const selected = products.find((p) => p.id === selectedId);
  const zone = destinations.find((d) => d.id === active);
  const select = useCallback((id: string) => {
    setPanel(null);
    setSelectedId(id);
    document.body.style.cursor = "";
  }, []);
  const onManualMove = useCallback(() => setActive("explore"), []);
  const onReady = useCallback(() => setReady(true), []);
  const navigate = (id: string) => {
    const d = destinations.find((d) => d.id === id);
    if (!d) return;
    setOverview(false);
    setActive(id);
    setJourney((j) => ({ key: j.key + 1, pose: { ...d.pose } }));
  };
  const toggleSaved = (id: string) =>
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((p) => p !== id)
        : [...previous, id],
    );
  return (
    <main className="experience">
      <h1 className="sr-only">Curated Seoul — เดินชมบูติกสกินแคร์สามมิติ</h1>
      <div className="world">
        <Suspense fallback={null}>
          <ShowroomScene
            journey={journey}
            overview={overview}
            paused={Boolean(selected || panel)}
            movement={movement}
            onSelect={select}
            onManualMove={onManualMove}
            onReady={onReady}
          />
        </Suspense>
      </div>
      {!ready && (
        <div className="loading-screen" role="status">
          <img src="/assets/logo-navy.webp" alt="Curated Seoul" />
          <span>กำลังเตรียมร้านให้คุณ…</span>
        </div>
      )}
      <div className="hud">
        <button
          className={
            "icon-button visibility-control " + (hidden ? "is-hidden-mode" : "")
          }
          aria-label={hidden ? "แสดง UI" : "ซ่อน UI"}
          aria-expanded={!hidden}
          aria-controls="showroom-panels"
          title={hidden ? "แสดง UI" : "ซ่อน UI"}
          onClick={() => {
            Object.assign(movement.current, {
              forward: false,
              backward: false,
              left: false,
              right: false,
            });
            setHidden((v) => !v);
          }}
        >
          {hidden ? <Eye size={19} /> : <EyeOff size={19} />}
          <span>{hidden ? "แสดง UI" : "ซ่อน UI"}</span>
        </button>
        <div id="showroom-panels" className="hud-panels" hidden={hidden}>
          <header className="brand-header">
            <img src="/assets/logo-navy.webp" alt="Curated Seoul" />
            <span>Refined selections from Seoul</span>
          </header>
          <div className="tools">
            <button
              className="icon-button"
              aria-label={overview ? "กลับไปเดินในร้าน" : "ดูภาพรวมร้าน"}
              title={overview ? "กลับไปเดินในร้าน" : "ดูภาพรวมร้าน"}
              aria-pressed={overview}
              onClick={() => {
                setOverview((v) => !v);
                if (overview) setJourney((j) => ({ ...j, key: j.key + 1 }));
              }}
            >
              {overview ? <Footprints size={19} /> : <Map size={19} />}
            </button>
            <button
              className="icon-button"
              aria-label="รายการที่เก็บไว้"
              title="รายการที่เก็บไว้"
              onClick={() => setPanel("saved")}
            >
              <Bookmark size={19} />
              {saved.length > 0 && (
                <span className="saved-count">{saved.length}</span>
              )}
            </button>
            <button
              className="icon-button help-tool"
              aria-label="วิธีเดินชมร้าน"
              title="วิธีเดินชมร้าน"
              onClick={() => setPanel("help")}
            >
              <Info size={19} />
            </button>
          </div>
          <div className="current-zone">
            <span className="zone-dot" />
            <div>
              <strong>
                {overview
                  ? "The beauty house"
                  : (zone?.label ?? "เดินชมได้ตามสบาย")}
              </strong>
              <span>
                {overview
                  ? "หมุนเพื่อดูพื้นที่ร้านทั้งหมด"
                  : (zone?.description ?? "ค่อย ๆ ค้นพบสิ่งที่ชอบ")}
              </span>
            </div>
          </div>
          {!overview && (
            <div className="walking-controls">
              <div
                className="movement-pad"
                role="group"
                aria-label="ปุ่มเดินชมร้าน"
              >
                {directions.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    className={"move-" + key}
                    aria-label={label}
                    disabled={!ready}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.setPointerCapture(e.pointerId);
                      movement.current[key] = true;
                    }}
                    onPointerUp={() => (movement.current[key] = false)}
                    onLostPointerCapture={() => (movement.current[key] = false)}
                    onPointerCancel={() => (movement.current[key] = false)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        movement.current[key] = true;
                      }
                    }}
                    onKeyUp={() => (movement.current[key] = false)}
                    onBlur={() => (movement.current[key] = false)}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              <div className="walking-tip">
                <span>
                  <kbd>W</kbd>
                  <kbd>A</kbd>
                  <kbd>S</kbd>
                  <kbd>D</kbd> เดินชมร้าน
                </span>
                <span>
                  <MousePointer2 size={12} /> ลากเพื่อมอง · แตะผลิตภัณฑ์เพื่อดู
                </span>
              </div>
            </div>
          )}
          <nav className="department-nav" aria-label="เลือกมุมชมร้าน">
            {destinations.map((d, i) => {
              const Icon = [Home, LayoutGrid, Layers3, Flower2, Camera][i];
              return (
                <button
                  key={d.id}
                  aria-current={
                    active === d.id && !overview ? "location" : undefined
                  }
                  onClick={() => navigate(d.id)}
                >
                  <Icon size={16} />
                  <span>{d.label}</span>
                </button>
              );
            })}
          </nav>
          <button
            className="collection-invite"
            onClick={() => select(products[0].id)}
          >
            <img src="/assets/balm-blue.webp" alt="" />
            <span>
              <small>The featured collection</small>
              <strong>Queen’s Balm</strong>
              <span>
                รู้จักคอลเลกชันนี้ <ArrowUpRight size={13} />
              </span>
            </span>
          </button>
        </div>
      </div>
      {selected && (
        <ProductDialog
          key={selected.id}
          product={selected}
          onSelect={select}
          saved={saved.includes(selected.id)}
          onSave={() => toggleSaved(selected.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
      {panel === "gallery" && (
        <Dialog
          title="ภาพจากคอลเลกชันแบรนด์"
          onClose={() => setPanel(null)}
          className="gallery-dialog"
        >
          <span className="brand-label">CURATED SEOUL</span>
          <h2>In the details.</h2>
          <p>แสง เนื้อสัมผัส และช่วงเวลาของการดูแลตัวเอง</p>
          <div className="gallery-grid">
            {gallery.map((p) => (
              <figure key={p.src}>
                <img src={p.src} alt={p.alt} />
              </figure>
            ))}
          </div>
        </Dialog>
      )}
      {panel === "saved" && (
        <Dialog
          title="รายการที่เก็บไว้"
          onClose={() => setPanel(null)}
          className="saved-dialog"
        >
          <Bookmark size={24} className="bronze" />
          <h2>เลือกไว้ให้ตัวเอง</h2>
          <p>ผลิตภัณฑ์ที่คุณอยากกลับมาดูอีกครั้ง</p>
          {saved.length ? (
            <div className="saved-list">
              {products
                .filter((p) => saved.includes(p.id))
                .map((p) => (
                  <div key={p.id}>
                    <button className="saved-item" onClick={() => select(p.id)}>
                      <img src={p.image} alt="" />
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.variant}</small>
                      </span>
                      <ArrowUpRight size={18} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label={"นำ " + p.variant + " ออกจากรายการ"}
                      onClick={() => toggleSaved(p.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <Flower2 size={33} />
              <strong>ยังไม่มีรายการที่เก็บไว้</strong>
              <span>แตะผลิตภัณฑ์ในร้าน แล้วเลือก “เก็บไว้ดูภายหลัง”</span>
              <button
                className="button primary"
                onClick={() => select(products[0].id)}
              >
                เริ่มชม Queen’s Balm <ArrowUpRight size={16} />
              </button>
            </div>
          )}
          <p className="product-note">
            รายการนี้ยังไม่ใช่คำสั่งซื้อ
            ราคาและรายละเอียดสินค้าจะอัปเดตเพิ่มเติม
          </p>
        </Dialog>
      )}
      {panel === "help" && (
        <Dialog
          title="ยินดีต้อนรับสู่ Curated Seoul"
          onClose={() => setPanel(null)}
          className="help-dialog"
        >
          <span className="brand-label">Make yourself at home</span>
          <h2>
            A little Seoul,
            <br />
            just for you.
          </h2>
          <p>ค่อย ๆ เดินชมร้านในจังหวะของคุณ</p>
          <ul>
            <li>
              <Check size={17} />
              ใช้ W A S D หรือปุ่มลูกศรเพื่อเดิน
            </li>
            <li>
              <Check size={17} />
              ลากพื้นที่ว่างเพื่อหันมองรอบร้าน
            </li>
            <li>
              <Check size={17} />
              แตะผลิตภัณฑ์เพื่อดูภาพและเก็บไว้ดูภายหลัง
            </li>
            <li>
              <Check size={17} />
              เลือกชื่อมุมด้านล่างเพื่อเดินทางไปชม
            </li>
          </ul>
          <div className="help-actions">
            <button className="button primary" onClick={() => setPanel(null)}>
              เริ่มเดินชม <Footprints size={17} />
            </button>
            <button
              className="button secondary"
              onClick={() => setPanel("gallery")}
            >
              ชมภาพแบรนด์ <Camera size={17} />
            </button>
          </div>
          <button
            className="reset-link"
            onClick={() => {
              setPanel(null);
              navigate("entrance");
            }}
          >
            <RotateCcw size={13} /> กลับหน้าร้าน
          </button>
        </Dialog>
      )}
    </main>
  );
}
