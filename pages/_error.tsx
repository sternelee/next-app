import * as React from 'react'
import Error from 'next/error'
import fetch from 'isomorphic-unfetch'

interface Props {
  statusCode: number
  stars: number
}

export default class Page extends React.Component<Props, {}> {
  static async getInitialProps() {
    const res: any = await fetch('https://api.github.com/repos/zeit/next.js')
    const statusCode = res.statusCode > 200 ? res.statusCode : false
    const json = await res.json()

    return { statusCode, stars: json.stargazers_count }
  }

  render() {
    if (this.props.statusCode) {
      return <Error statusCode={this.props.statusCode} />
    }

    return (
      <div>
        Next stars: {this.props.stars}
      </div>
    )
  }
}