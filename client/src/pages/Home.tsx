import Hero from '../components/Hero.tsx'
import TrendingMovies from '../components/TrendingMovies.tsx'
const Home = () => {
  return (
    <div className='mt-5'>
      <div className='justify-center items-center flex'>
        <Hero />
      </div>
      <TrendingMovies />
      
    </div>
  )
}

export default Home
