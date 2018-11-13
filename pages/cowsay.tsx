import cowsay from 'cowsay-browser'

export default () => (
    <pre>
        {cowsay.say({ text: 'I love SSR!' })}
    </pre>
)