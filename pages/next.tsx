import Head from 'next/head'

export default () => (<div>
    <Head>
        <title>Next.js</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <style jsx>{`
        p {
            color: red;
            font-size: 30px;
        }
    `}
    </style>
    <style global jsx>{`
      body {
        background: #ccc;
      }
    `}</style>
    <p>Welcome to Next.js</p>
</div>)