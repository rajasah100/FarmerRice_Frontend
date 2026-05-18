import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { productAPI } from "@/api/productApi";
import { portfolioAPI } from "@/api/portfolioApi";

const PortfolioCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const decodedCategory = decodeURIComponent(category || "");

  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products for this category + the portfolio info (for hero)
        const [productsRes, portfoliosRes] = await Promise.all([
          productAPI.getAll(decodedCategory),
          portfolioAPI.getAll({ category: decodedCategory }),
        ]);
        setProducts(productsRes.data.data || []);
        // Find the matching portfolio for header text
        const portfolios = portfoliosRes.data.data || [];
        setPortfolio(
          portfolios.find((p) => p.category === decodedCategory) ||
            portfolios[0] ||
            null
        );
        setError("");
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decodedCategory]);

  return (
    <div className="min-h-screen bg-[#f7f3ec]">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#7b5a42] to-[#9a6b4d] pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/portfolio")}
            className="inline-flex items-center gap-2 text-amber-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to all categories</span>
          </button>

          <p className="uppercase tracking-[3px] text-amber-100/80 text-xs font-semibold mb-4">
            {decodedCategory} Category
          </p>
          <h1 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
            {portfolio?.title || `${decodedCategory} Products`}
          </h1>
          {portfolio?.description && (
            <p className="text-amber-100/90 text-base md:text-lg max-w-3xl leading-relaxed">
              {portfolio.description}
            </p>
          )}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-[#7b5a42] text-2xl md:text-3xl">
            Products in this range
          </h2>
          <span className="text-[#9a7c63] text-sm">
            {products.length} product{products.length !== 1 && "s"}
          </span>
        </div>

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

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-[#e3d4c1]">
            <Package size={48} className="mx-auto text-[#c4a888] mb-4" />
            <p className="text-[#7b5a42] text-lg">
              No products available in this category yet.
            </p>
            <p className="text-[#9a7c63] text-sm mt-2">
              Check back soon for updates.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
                        className="px-2.5 py-1 bg-[#f3eadb] text-[#7b5a42] text-xs font-medium rounded-full"
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

        {/* Other categories CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-[#7b5a42] hover:text-[#68452d] font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            Explore other categories
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PortfolioCategory;
