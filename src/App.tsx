import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { extendTheme, NativeBaseProvider } from 'native-base'

const App = () => {
  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          rounded: '100',
        },
      },
    },
    colors: {
      primary: {
        50: '#FFFFFF',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#0088CC',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      amber: {
        400: '#d97706',
      },
    },
  })

  const nbConfig = {
    dependencies: {
      'linear-gradient': require('react-native-linear-gradient').default,
    },
  }

  return (
    <NativeBaseProvider theme={theme} config={nbConfig}>
      <Provider store={store}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  )
}

export default App
