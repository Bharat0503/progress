import { createNavigationContainerRef, DrawerActions,StackActions } from '@react-navigation/native';


export const navigationRef = createNavigationContainerRef();

class NavigationService {
    navigationRef: any;
  navigate(name: string, params?: object|undefined) {
        if (navigationRef.isReady()) {
                navigationRef.navigate(name, params);
            }
        }

    goBack() {
        if (navigationRef.isReady() && navigationRef.canGoBack()) {
            navigationRef.goBack();
        }
    }

    openDrawer() {
        if (navigationRef.isReady()) {
            navigationRef.dispatch(DrawerActions.openDrawer());
        }
    }

    closeDrawer() {
        if (navigationRef.isReady()) {
            navigationRef.dispatch(DrawerActions.closeDrawer());
        }
    }

    toggleDrawer() {
        if (navigationRef.isReady()) {
            navigationRef.dispatch(DrawerActions.toggleDrawer());
        }
    }

  pop(count = 1) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(count));
    }
  }

  // reset(routes: { name: string, params:object }[], index = 0) {
  //   if (navigationRef.isReady()) {
  //     navigationRef.reset({
  //         index,
  //       routes,
  //     });
  // }
  // }

  reset(routes: Array<{ name: string; params: object }>, index = 0) {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index,
            routes,
        });
    }
}

  push(name: string, params?: object | undefined) {
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      // Check if the current route is the same as the target route
      if (currentRoute?.name === name) {
        navigationRef.navigate(name, { ...params, key: Date.now().toString() });
      } else {
        navigationRef.navigate(name, params);
      }
    }
  }
  // Add other navigation methods as needed, like `push`, `replace`, etc.


  /**
     * Adds a listener for navigation events.
     * @param eventType - The event type (e.g., 'state', 'focus', 'blur', 'beforeRemove').
     * @param callback - The function to execute when the event occurs.
     * @returns A function to remove the listener.
     */
    addListener(eventType: string, callback: (event: any) => void) {
        if (navigationRef.isReady()) {
            return navigationRef.addListener(eventType, callback);
        }
        return () => {}; // Return a no-op function if navigationRef is not ready
    }
}

export default new NavigationService();