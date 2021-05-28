import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  // hooks
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // handlers
  // function fetchMoviesHandler() {
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const transformedMovies = data.results.map((movieData) => {
  //         return {
  //           id: movieData.episode_id,
  //           title: movieData.title,
  //           openingText: movieData.opening_crawl,
  //           releaseDate: movieData.release_date,
  //         };
  //       });
  //       setMovies(transformedMovies);
  //     })
  //     .catch();
  // }

  // or
  const fetchMoviesHandler = useCallback(async () => {
    // change the state when starting loading the data
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films/");

      // by default, fetch api does not throw for non 200 and 300 http status
      // axios does.
      // so, here, we have to check it manually
      if (!response.ok) {
        throw new Error("Something went wrong!!!");
      }

      const json = await response.json();

      const transformedMovies = json.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }

    // change the state again after loaded the data
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
    // since the fetchMoviesHandler never change (since it does not have other dependencies)
    // so, fetchMoviesHandler will only be called once when component first mounted
    // *** IMPORTANT ***
    // however, since in JS, object !== object
    // that means every time when state (movies) change,
    // fetchMoviesHandler will be different from the previous one
    // that means fetchMoviesHandler will get called over and over again
    // to fix that, we need to use `useCallback` for fetchMoviesHandler function
    // so that, React can store the function somewhere and use it the same function instead creating new one (again, new function will be different in memory)
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
