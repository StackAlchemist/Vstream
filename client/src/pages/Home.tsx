import Hero from '../components/Hero.tsx'
// import MyList from '../components/MyList.tsx'
import TrendingMovies from '../components/TrendingMovies.tsx'
import TvShows from '../components/TvShows.tsx'
const Home = () => {
  return (
    <div className='mt-5'>
      <div className='justify-center items-center flex'>
        <Hero />
      </div>
      
      {/* <MyList /> */}
      <TrendingMovies />
      <TvShows />
      
    </div>
  )
}

export default Home
