import CostTree from '../components/CostTree'
import withData from '../lib/withData'

export default withData(() => (
  <div>
    <style global jsx>{`
      body {
        font-family: Roboto Mono;
        margin: 1em 2em;
      }
    `}</style>
    <h1>Cost feasibility</h1>
    <CostTree />
  </div>
))
