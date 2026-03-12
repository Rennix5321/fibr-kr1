import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api/productsApi";
import "./App.css";

/**
 * Практика 4 (заготовка).
 * Важно: это НЕ готовое решение. В файле api/productsApi.js стоят TODO.
 * Цель: подключить React к вашему Express API и выполнить базовый CRUD.
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const canSubmit = useMemo(() => title.trim() !== "" && price !== "", [title, price]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    try {
      await createProduct({
        title: title.trim(),
        price: Number(price),
        category,
        description,
        stock: Number(stock),
        image
      });

      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setStock("");
      setImage("");

      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onPricePlus(id, currentPrice) {
    setError("");
    try {
      await updateProduct(id, { price: Number(currentPrice) + 10 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui",
        background: "#f7f7f7",
        minHeight: "100vh"
      }}
    >
      <h1>Практика 4 — React + Express API</h1>

      <p style={{ color: "#555" }}>
        Если видите ошибку <code>TODO: реализуйте ...</code>, значит вы ещё не реализовали функции в{" "}
        <code>src/api/productsApi.js</code>.
      </p>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Добавить товар</h2>

        <form
          onSubmit={onAdd}
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            background: "white",
            padding: 16,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            style={{ padding: 10, minWidth: 220, borderRadius: 6, border: "1px solid #ccc" }}
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
            type="number"
            style={{ padding: 10, width: 140, borderRadius: 6, border: "1px solid #ccc" }}
          />

          <input
            placeholder="Категория"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          />

          <input
            placeholder="Остаток на складе"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          />

          <input
            placeholder="Картинка (URL)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          />

          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: 10, minWidth: 220, borderRadius: 6, border: "1px solid #ccc" }}
          />

          <button
            disabled={!canSubmit}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "none",
              background: "#2c7be5",
              color: "white",
              cursor: "pointer"
            }}
          >
            Добавить
          </button>

          <button
            type="button"
            onClick={load}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "none",
              background: "#6c757d",
              color: "white",
              cursor: "pointer"
            }}
          >
            Обновить список
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Список товаров</h2>

        {loading && <p>Загрузка...</p>}

        {error && (
          <p style={{ color: "crimson" }}>
            Ошибка: {error}
            <br />
            Проверьте, что: (1) backend запущен на 3000, (2) CORS настроен, (3) TODO в productsApi.js реализованы.
          </p>
        )}

        <ul
          style={{
            paddingLeft: 0,
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          {items.map((p) => (
            <li
              key={p.id}
              style={{
                background: "white",
                padding: 14,
                borderRadius: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <b>{p.title}</b> — {p.price} ₽

              {p.category && (
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                  {p.category}
                </div>
              )}

              {p.description && (
                <div style={{ marginTop: 6, fontSize: 14 }}>
                  {p.description}
                </div>
              )}

              {p.stock !== undefined && (
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  Остаток: {p.stock}
                </div>
              )}

              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    borderRadius: 6
                  }}
                />
              )}

              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => onPricePlus(p.id, p.price)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "#2c7be5",
                    color: "white",
                    cursor: "pointer",
                    marginRight: 6
                  }}
                >
                  +10 ₽
                </button>

                <button
                  onClick={() => onDelete(p.id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "#e55353",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>

        <p style={{ color: "#555" }}>
          TODO (студентам): добавить категории, описание, остаток на складе, картинку и т.п. + сделать красивый UI.
        </p>
      </section>
    </div>
  );
}