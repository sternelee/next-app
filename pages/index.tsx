import Link from 'next/link'

export default () => (
  <div>
    Click{' '}
    <Link href="/next">
      <a>here</a>
    </Link>{' '}
    to read more
    <br />
    Click{' '}
    <Link href="/cowsay">
      <a>cowsay</a>
    </Link>{' '}
    <br />
    Click{' '}
    <Link href="/stars">
        <a>Stars</a>
    </Link>{' '}
    <br />
    Click{' '}
    <Link href="/dynamic">
        <a>dynamic for gif page</a>
    </Link>{' '}
    <br />
    Click{' '}
    <Link href="/verify">
        <a>实名认证</a>
    </Link>{' '}
  </div>
)