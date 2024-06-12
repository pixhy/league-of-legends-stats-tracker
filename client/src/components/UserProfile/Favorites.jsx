import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Favorite from './Favorite';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';


const Favorites = () => {
  const userName = useOutletContext();
  const [favoritePlayers, setFavoritePlayers] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetch(`/api/favoritePlayers/${userName}`);
      const favorites = await response.json();
      setFavoritePlayers(favorites);
    };
    fetchFavorites();
  }, []);

  const handleDelete = async (event, favoriteId) => {
    event.stopPropagation()
    const response = await fetch(`/api/favoritePlayers/${userName}/${favoriteId}`,{
      method: 'DELETE'
    });
    if (response.ok) {
      setFavoritePlayers(favoritePlayers.filter(favorite => favorite._id != favoriteId))
      alert('Successfully deleted.')
    } else {
      alert('delete NO.')
    }
  }

  if (favoritePlayers === null) {
    return <Loading />
  } else if(favoritePlayers.length === 0) {
    return (<div>There are no favorites yet</div>)
  }
  

  return (
    <>
      <ul> YOUR FAVOURITES
        {favoritePlayers.map((favorite) => 
          <li key={favorite._id} onClick={() => navigate(`/summoners/eune/${favorite.gameName}/${favorite.tagLine}`)}> 
            <Favorite favorite={favorite} />
            <button onClick={(e) => handleDelete(e, favorite._id)}>Delete</button>
          </li>
        )}
      </ul>
    </>
  );
};

export default Favorites;
