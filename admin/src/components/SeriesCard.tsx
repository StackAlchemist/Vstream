import React from "react";
import { Series } from "../types/Series";


interface Props {
  series: Series;
}

const SeriesCard: React.FC<Props> = ({ series }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-all">
      <img src={series.coverImg} alt={series.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{series.title}</h2>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{series.description}</p>
      </div>
    </div>
  );
};

export default SeriesCard;
