import infoPic from '../assets/infopic.jpg'


function Info(){
  return(
    <div className="info">
      <div className="infoImage">
        <img src={infoPic} />
      </div>
      <div className="infoText">
        <span className="infoTextTitle"> Penzi </span>
        <span className="infoTextInfo"> A dating site with 6000 potential dating partners!.</span>
      </div>
    </div>
  )
}

export default Info
