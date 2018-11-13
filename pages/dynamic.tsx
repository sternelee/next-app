import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./gif'), {
    loading: () => <p>Loading ...</p>
})

export default () => (
  <div>
    <DynamicComponent />
    <p>Gif PAGE is here!</p>
  </div>
)