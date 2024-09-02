import "./MainContent.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Pagination from "./Pagination.tsx";
import { useNavigate } from "react-router-dom";

type Game = {
  title: string;
  description: string;
  category: string;
  image: string;
  id: number;
};

interface Props {
  selectedCategory: string;
  searchTerm: string;
}

function MainContent({ selectedCategory, searchTerm }: Props) {
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);
  const navigate = useNavigate();

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/api/games");
    setGames(response.data.games);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // Resetowanie numeru strony do 1 po zmianie kategorii
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredGames.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCardClick = (category: string, id: number) => {
    navigate(`/${category}/${id}`);
  };

  return (
    <div className="main-content-container">
      <div className="row row-cols-2 row-cols-md-3 g-4">
        {currentCards.map((game, index) => (
          <div className="col" key={index}>
            <div
              className="card h"
              style={{ width: "15vw", height: "35vh", cursor: "pointer" }}
              onClick={() => handleCardClick(game.category, game.id)}
            >
              <img src={game.image} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text">{game.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        cardsPerPage={cardsPerPage}
        totalCards={filteredGames.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}

export default MainContent;
