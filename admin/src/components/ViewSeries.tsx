import axios from "axios";
import { useEffect, useState } from "react";
import SeriesCard from "./SeriesCard";
import { Series } from "../types/Series";
const ViewSeries = () => {
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get<Series[]>(import.meta.env.VITE_API_URL + "/series/get");
                setSeriesList(response.data);
            } catch (err) {
                setError("Failed to load series.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeries();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">TV Series</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {seriesList.map((series) => (
                    <SeriesCard key={series._id} series={series} />
                ))}
            </div>
        </div>
    );
}
export default ViewSeries