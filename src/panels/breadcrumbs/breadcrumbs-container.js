import "./breadcrumbs.css";

function BreadcrumbItem({ b, map }) {
  return (
    <span
      className="breadcrumb"
      onClick={() => map.flyToBounds(b.location_awareness.bbox)}
    >
      {b.id}
    </span>
  );
}

export default function BreadcrumbsContainer({ breadcrumbs, map }) {
  if (!breadcrumbs)
    return (
      <div className="breadcrumbs-container">
        <div className="breadcrumb">{"None"}</div>
      </div>
    );

  return (
    <div className="breadcrumbs-container">
      {breadcrumbs.slice(0, breadcrumbs.length - 1).map((b) => (
        <>
          <BreadcrumbItem b={b} map={map} />
          {breadcrumbs.length > 0 && " > "}
        </>
      ))}
      {breadcrumbs.length > 0 && (
        <BreadcrumbItem b={breadcrumbs.at(breadcrumbs.length - 1)} map={map} />
      )}
    </div>
  );
}
