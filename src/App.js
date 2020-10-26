import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [ movieList, setMovieList] = useState([]);
  const [ featuredData, setFeaturedData] = useState(null);
  const [ blackHeader, setBlackHeader ] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o filme em destaque (Featured Movie)
      let originals = list.filter(i=> i.slug === 'originals');
      let randomChoosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let choosen = originals[0].items.results[randomChoosen];
      let choosenInfo = await Tmdb.getMovieInfo(choosen.id, 'tv');
      
      setFeaturedData(choosenInfo);

    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData && 
        <FeaturedMovie item={featuredData}/>
      }
      <section className="lists">
        {movieList.map( (item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer className="footer--text">
        Feito com <span role="img" aria-label="coração">💙</span> por Lemuel P. Figueira<br/>
        Direitos de imagem para Netflix<br/>
        Dados retirados do site Themoviedb.org
      </footer>

      { movieList.length <= 0 &&
        <div className="loading">
          <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/Netflix_LoadTime-scaled.gif"/>

        </div>
      }
    </div>
  );
}