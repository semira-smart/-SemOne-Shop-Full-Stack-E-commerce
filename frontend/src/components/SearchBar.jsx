import { useEffect, useRef, useState } from "react";
import { productService } from "../services/productService";
import "../styles/searchbar.css";

const SearchBar = ({
  placeholder = "Search products...",
  onSearch,
  minChars = 2,
  maxSuggestions = 6,
}) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!boxRef.current || boxRef.current.contains(e.target)) return;
      setOpen(false);
      setActive(-1);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (text.trim().length < minChars) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await productService.getAllProducts(1, maxSuggestions, text.trim());
        const items = res?.products || [];
        setSuggestions(items);
        setOpen(items.length > 0);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [text, minChars, maxSuggestions]);

  const submit = (q) => {
    const query = (q ?? text).trim();
    if (!query) return;
    onSearch?.(query);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) submit(suggestions[active].name || text);
      else submit(text);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className="searchbar" ref={boxRef}>
      <div className="searchbar-input">
        <span className="icon" aria-hidden>🔎</span>
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search products"
        />
        {text && (
          <button className="clear" onClick={() => { setText(""); setOpen(false); }}>
            ✕
          </button>
        )}
        <button className="submit" onClick={() => submit()}>
          Search
        </button>
      </div>

      {open && (
        <div className="searchbar-dropdown">
          {loading && <div className="dropdown-item muted">Searching…</div>}
          {!loading && suggestions.length === 0 && (
            <div className="dropdown-item muted">No results</div>
          )}
          {!loading && suggestions.map((p, idx) => {
            const imageSrc = p.image?.startsWith("http")
              ? p.image
              : p.image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200";
            return (
              <button
                key={p._id || `${p.name}-${idx}`}
                className={`dropdown-item ${idx === active ? "active" : ""}`}
                onMouseEnter={() => setActive(idx)}
                onClick={() => submit(p.name)}
              >
                <img src={imageSrc} alt={p.name} />
                <div className="meta">
                  <div className="name">{p.name}</div>
                  <div className="sub">
                    <span className="price">${Number(p.price || 0).toFixed(2)}</span>
                    <span className="dot">•</span>
                    <span className="cat">{p.category || "General"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;