import Card from "./Card";

export default function Row({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 px-4 text-lg font-semibold md:px-12 md:text-xl">
        {title}
      </h2>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2 md:gap-3 md:px-12">
        {items.map((item, i) => (
          <Card key={`${item.media_type}-${item.id ?? i}`} item={item} />
        ))}
      </div>
    </section>
  );
}
