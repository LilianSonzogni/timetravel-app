import Header from './components/Header'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import VideoGallery from './components/VideoGallery'
import Quiz from './components/Quiz'
import About from './components/About'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <main>
        <Hero />
        <Destinations />
        <VideoGallery />
        <Quiz />
        <About />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

export default App
