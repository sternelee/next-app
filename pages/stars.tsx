const Starts = ({ stars, owner }) =>
  <div>
    Next stars: {stars}
    <br />
    <p>avatar_url: <a href={owner.avatar_url} >{owner.avatar_url}</a></p>
    <p>followers_url: <a href={owner.avatar_url}>{owner.avatar_url}</a></p>
    <div>
      {Object.entries(owner).map(vals => {
        <p><span>{vals[0]}</span>: <span style={{marginLeft: '12px'}}>{vals[1]}</span></p>
      })}
    </div>
  </div>

Starts.getInitialProps = async ({ req }) => {
    const res = await fetch('https://api.github.com/repos/zeit/next.js')
    const json = await res.json()
    return { stars: json.stargazers_count, owner: json.owner }
}

export default Starts