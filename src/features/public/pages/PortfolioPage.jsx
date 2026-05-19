import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package } from "lucide-react";
import { productAPI } from "@/api/productApi";
import portfolioBanner from "@/assets/Portfolio-listing-banner.jpg";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);

  // keep state in sync if user clicks browser back/forward
  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAll();
        setProducts(res.data.data || []);
        setError("");
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // unique categories from products
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#1a2a1f] overflow-x-hidden">
      {/* HERO BANNER */}
      <section className="relative h-[60vh] min-h-[400px] max-w-355 mx-auto flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${portfolioBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5e3d2b]/80 via-[#5e3d2b]/30 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pb-16 text-white">
          <p className="uppercase tracking-[4px] text-amber-100 text-sm font-semibold mb-4">
            Our Products
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight">
            Premium Rice Collection
          </h1>
          <p className="text-amber-100/90 text-base md:text-lg mt-4 max-w-2xl">
            Discover our complete range of premium basmati and specialty rice
            varieties.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER + COUNT */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-12">
        {!loading && !error && categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat
                    ? "bg-[#7b5a42] text-white shadow-md"
                    : "bg-white text-[#7b5a42] border border-[#e3d4c1] hover:bg-[#f3eadb]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-[#7b5a42] text-2xl md:text-3xl">
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h2>
          <span className="text-[#9a7c63] text-sm">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 && "s"}
          </span>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        {loading && (
          <div className="text-center text-[#7b5a42] py-20">
            Loading products...
          </div>
        )}

        {error && (
          <div className="text-center text-red-700 bg-red-50 border border-red-200 rounded-lg py-6 px-4">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-[#e3d4c1]">
            <Package size={48} className="mx-auto text-[#c4a888] mb-4" />
            <p className="text-[#7b5a42] text-lg">No products found.</p>
            <p className="text-[#9a7c63] text-sm mt-2">
              Check back soon for updates.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <article
              key={product._id}
              className="bg-white rounded-xl border border-[#e3d4c1] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="aspect-[4/3] bg-[#f8f3ec] overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={48} className="text-[#c4a888]" />
                  </div>
                )}
              </div>

              <div className="p-6">
                {product.category && (
                  <span className="inline-block px-2.5 py-1 bg-[#f3eadb] text-[#7b5a42] text-xs font-medium rounded-full mb-3">
                    {product.category}
                  </span>
                )}
                <h3 className="font-serif text-[#6d513d] text-xl mb-2">
                  {product.name}
                </h3>
                {product.shortDescription && (
                  <p className="text-sm text-[#9a7c63] italic mb-3">
                    {product.shortDescription}
                  </p>
                )}
                <p className="text-[#7a6656] text-sm leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#f8f3ec] text-[#7b5a42] text-xs rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#e3d4c1]">
                  {product.weight && (
                    <span className="text-sm text-[#7b5a42] font-medium">
                      {product.weight}
                    </span>
                  )}
                  {product.price && (
                    <span className="text-sm text-[#6d513d] font-bold">
                      {product.price}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 text-[#7b5a42] hover:text-[#68452d] font-semibold transition-colors"
          >
            Get in touch for bulk orders →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
