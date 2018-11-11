import { createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
},
{
  initialRouteName: 'Login',
});

export default AppNavigator;
