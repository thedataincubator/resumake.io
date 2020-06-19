/**
 * @flow
 */

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import persistState from 'redux-localstorage'
import reducer from './reducer'

const middleware = [thunk]

if (process.env.NODE_ENV === 'development') {
  middleware.push(
    createLogger({
      predicate: (_, action) => !action.type.startsWith('@@redux-form')
    })
  )
}

const enhancer = composeWithDevTools(
  applyMiddleware(...middleware),
  persistState(
    ['form', 'progress', 'tdi'],
    {
      key: 'resumake',
      slicer: (paths) => (state) => {
        // TODO: too risky and untested! Just a quick (and cool) solution not to persist fellowData.
        const subset = {}
        paths.forEach((path) => {
          if (path !== 'tdi') {
            subset[path] = state[path]
          } else {
            const { fellowData, ...tdiStateRest } = state[path]
            subset[path] = tdiStateRest
          }
        })
        return subset
      }
    }
  )
)

const store = createStore(reducer, enhancer)

export default store
