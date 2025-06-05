import { Request, Response } from "express"
import Movies from "../models/moviesModel"
import Series from "../models/seriesModel"

export const getViewership = async (req: Request, res: Response) => {
    try {
        const movies = await Movies.find({})
        const series = await Series.find({})

        const viewership = [...movies, ...series]

        res.status(200).json(viewership)
    } catch (error) {
        res.status(500).json({ message: "Error fetching viewership" })
    }
}