const Favorite = ({ favorite }) => {
  return (
      <div className='favUser'>
        <img src={`../profileicon/${favorite.profileIconId}.png`} alt="" />
        <div>{favorite.gameName} # {favorite.tagLine}</div> 
      </div>
  );
};

export default Favorite;
